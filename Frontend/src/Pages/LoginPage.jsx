import { useContext, useState, useEffect } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../Context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  // Reset fields when switching states
  useEffect(() => {
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  }, [currState]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden p-4 sm:p-8">
      
      {/* Decorative Light Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 rounded-bl-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100/50 rounded-tr-full blur-[80px] pointer-events-none"></div>

      <div className="w-full flex flex-col md:flex-row items-center justify-center max-w-5xl gap-12 md:gap-20 z-10">
        
        {/* Left Branding area */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left drop-shadow-sm">
           <img src={assets.logo_big || assets.logo} alt="Logo" className="w-48 md:w-64 mb-6 hover:scale-105 transition-transform duration-500" style={{filter: "brightness(0.8)"}} />
           <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">
             Connect Instantly.
           </h1>
           <p className="text-gray-600 text-lg md:text-xl max-w-md">
             Join the network where conversations flow seamlessly. Secure, fast, and professional.
           </p>
        </div>

        {/* Right Form Area */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6"
        >
          <div className="mb-2">
             <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
               {currState === "Sign up" ? "Create an Account" : "Welcome Back"}
             </h2>
             <p className="text-gray-500 text-sm">
               {currState === "Sign up" ? "Sign up to get started" : "Please enter your details to sign in"}
             </p>
          </div>

          <div className="flex flex-col gap-4">
            {currState === "Sign up" && (
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                />
              </div>
            )}
            
            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            {currState === "Sign up" && (
              <div className="relative group">
                <textarea
                  rows={2}
                  placeholder="Provide a short bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-none h-24"
                />
              </div>
            )}
          </div>

          {currState === "Sign up" && (
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-2 cursor-pointer">
              <input 
                type="checkbox" 
                required 
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
              />
              <p>I agree to the <span className="text-blue-600 font-medium hover:underline">Terms</span> & <span className="text-blue-600 font-medium hover:underline">Privacy Policy</span></p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-md shadow-blue-500/30"
          >
            {currState === "Sign up" ? "Create Account" : "Sign In"}
          </button>

          <div className="mt-4 text-center">
            {currState === "Sign up" ? (
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setCurrState("Login")}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
                >
                  Log in Instead
                </button>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setCurrState("Sign up")}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </form>
      </div>

    </div>
  );
};

export default LoginPage;
