import { SignupForm } from "@/components/auth/signup-form";

const SignUpPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6  md:p-10">
      <div className="w-full md:max-w-3xl ">
        <SignupForm />
      </div>
    </div>
  );
};
export default SignUpPage;
