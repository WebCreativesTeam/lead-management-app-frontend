// components/Facebook.jsx

// import facebookLogo from '../path-to-facebook-icon.svg'; // Path to a Facebook icon SVG

const Facebook = () => {
    const handleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_API_LINK;
        const url = `${backendUrl}/integration/facebook`;

        window.open(url, 'facebookLogin', 'width=600,height=700');
    };

    return (
        <button onClick={handleLogin} className="facebook-login-btn">
            {/* <img src={facebookLogo} alt="Facebook Icon" className="facebook-icon" /> */}
            Login with Facebook
        </button>
    );
};

export default Facebook;
