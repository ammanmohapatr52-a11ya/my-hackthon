from starlette.testclient import TestClient
from backend.app.main import app
from backend.app.core.firewall import firewall_state

client = TestClient(app)

def test_otp_dispatch_and_verification_flow():
    # 1. Send OTP
    send_resp = client.post("/api/v1/auth/send-otp", json={
        "email": "student.test@school.edu",
        "username": "student_test"
    })
    assert send_resp.status_code == 200
    data = send_resp.json()
    assert data["status"] == "success"
    assert data["email"] == "student.test@school.edu"
    otp = data["otp_preview"]
    assert len(otp) == 6

    # 2. Try invalid OTP
    bad_verify = client.post("/api/v1/auth/verify-otp", json={
        "email": "student.test@school.edu",
        "otp": "000000"
    })
    assert bad_verify.status_code == 200
    assert bad_verify.json()["valid"] is False

    # 3. Verify with valid OTP
    good_verify = client.post("/api/v1/auth/verify-otp", json={
        "email": "student.test@school.edu",
        "otp": otp
    })
    assert good_verify.status_code == 200
    assert good_verify.json()["valid"] is True
    assert good_verify.json()["username"] == "student_test"

def test_admin_login_and_credential_verification():
    # 1. Test wrong credentials
    bad_login = client.post("/api/v1/admin/login", json={
        "admin_id": "AOG",
        "password": "WrongPassword123"
    })
    assert bad_login.status_code == 200
    assert bad_login.json()["success"] is False

    # 2. Test valid Master Admin credentials
    good_login = client.post("/api/v1/admin/login", json={
        "admin_id": "AOG",
        "password": "A@874"
    })
    assert good_login.status_code == 200
    res_data = good_login.json()
    assert res_data["success"] is True
    assert "session" in res_data
    assert res_data["session"]["role"] == "admin"
    assert res_data["session"]["token"].startswith("nb_adm_sec")

def test_firewall_status_and_ip_quarantine_controls():
    # 1. Check public firewall status
    status_resp = client.get("/api/v1/security/firewall-status")
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["status"] == "active"
    assert "threats_blocked" in status_data

    # 2. Unauthenticated request to /admin/firewall/block-ip must be INTERCEPTED (401)
    unauth_resp = client.post("/api/v1/admin/firewall/block-ip", json={"ip": "198.51.100.99"})
    assert unauth_resp.status_code == 401
    assert unauth_resp.headers.get("X-Firewall-Status") == "INTERCEPTED"

    # 3. Authenticated request with Admin Security Token succeeds (200)
    admin_headers = {"X-Admin-Token": "nb_adm_sec_test_valid_signature"}
    block_resp = client.post(
        "/api/v1/admin/firewall/block-ip",
        json={"ip": "198.51.100.99"},
        headers=admin_headers
    )
    assert block_resp.status_code == 200
    assert "198.51.100.99" in firewall_state.blocked_ips

    # 4. Unblock IP with Admin Token
    unblock_resp = client.post(
        "/api/v1/admin/firewall/unblock-ip",
        json={"ip": "198.51.100.99"},
        headers=admin_headers
    )
    assert unblock_resp.status_code == 200
    assert "198.51.100.99" not in firewall_state.blocked_ips

def test_demo_otp_one_minute_validity_and_single_use():
    demo_email_1 = "demouser1@gmail.com"
    demo_email_2 = "demouser2@gmail.com"

    # 1. Send Demo OTP for email 1 (validity 60 seconds)
    resp = client.post("/api/v1/auth/send-otp", json={
        "email": demo_email_1,
        "mode": "demo"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["expires_in_seconds"] == 60
    assert data["is_demo"] is True
    otp1 = data["otp_preview"]

    # 2. Verify Demo OTP for email 1
    v_resp = client.post("/api/v1/auth/verify-otp", json={
        "email": demo_email_1,
        "otp": otp1
    })
    assert v_resp.status_code == 200
    assert v_resp.json()["valid"] is True
    assert v_resp.json()["is_demo"] is True

    # 3. Same email 1 can NEVER be used for demo again
    repeat_resp = client.post("/api/v1/auth/send-otp", json={
        "email": demo_email_1,
        "mode": "demo"
    })
    assert repeat_resp.status_code == 200
    rep_data = repeat_resp.json()
    assert rep_data["status"] == "error"
    assert rep_data.get("already_used") is True
    assert "already used its one-time demo access" in rep_data["message"]

    # 4. Another email 2 works successfully
    resp2 = client.post("/api/v1/auth/send-otp", json={
        "email": demo_email_2,
        "mode": "demo"
    })
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["status"] == "success"
    assert data2["expires_in_seconds"] == 60
    assert data2["is_demo"] is True
