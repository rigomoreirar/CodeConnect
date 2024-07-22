from django.contrib.auth.hashers import check_password

# Replace these with your actual values
stored_hashed_password = 'pbkdf2_sha256$600000$EFtNroy7A8COTVjJUXtJdR$EmwRbaLDckEV0zFXhu5/pNRQ/PyzozerBjPG0Z4QBcc='
raw_password = '30sqsCfg'

if check_password(raw_password, stored_hashed_password):
    print("Password matches")
else:
    print("Password does not match")