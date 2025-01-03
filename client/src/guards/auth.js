const checkAuth = () => {

    const token = localStorage.getItem("access");
    if (!token) {
        window.location.href = "/login"
        return false;
    }
    
    return true;
}

export default checkAuth;