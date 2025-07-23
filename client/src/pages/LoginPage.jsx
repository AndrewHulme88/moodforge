import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
