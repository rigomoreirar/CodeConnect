const environment = "development"; // Change this as needed

const baseURL = environment === "development" ? "http://localhost:8000/api" : "/api";

const endpoints = {
    auth: {
        register: `${baseURL}/register/`,
        login: `${baseURL}/login/`,
        logout: `${baseURL}/logout/`,
    },
    user: {
        getAllData: `${baseURL}/get-all-data/`,
        editUserInfo: `${baseURL}/edit-user-info/`,
        changeUserPassword: `${baseURL}/change-user-password/`,
    },
    emails: {
        sendTestEmail: `${baseURL}/send-test-email/`,
        resetUserPasswordEmail: `${baseURL}/reset-user-password-email/`,
    },
};

export default endpoints;
