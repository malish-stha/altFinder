import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090e] px-4 py-12">
      <div className="w-full max-w-md flex justify-center">
        <SignIn
          path="/sign-in"
          appearance={{
            elements: {
              card: "border border-white/5 bg-white/5 backdrop-blur-xl rounded-none shadow-2xl",
              headerTitle: "text-white font-display",
              headerSubtitle: "text-gray-400 font-sans",
              socialButtonsBlockButton: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-sans",
              formFieldLabel: "text-gray-300 font-sans",
              formFieldInput: "bg-white/5 border border-white/10 text-white rounded-none",
              footerActionLink: "text-indigo-400 hover:text-indigo-300 font-sans"
            }
          }}
        />
      </div>
    </div>
  );
}
