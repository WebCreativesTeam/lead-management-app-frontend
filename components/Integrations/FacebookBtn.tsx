const FacebookBtn = () => {
    const handleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_API_LINK;
        const url = `${backendUrl}/integration/facebook`;

        window.open(url, 'facebookLogin', 'width=600,height=700');
    };

    return (
        <button
            onClick={handleLogin}
            className="my-4 cursor-pointer rounded-md border-0 bg-[#4267b2] px-3 py-2 text-base text-white transition-colors duration-300 hover:bg-[#365899] focus:outline-none"
        >
            Login with Facebook
        </button>
    );
};

export default FacebookBtn;
