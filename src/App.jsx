import LoginForm from "./components/auth/LoginForm"
import SignupForm from "./components/auth/SignupForm"

function App() {
  const isLoggedIn = false

  return (
    <>
      {isLoggedIn ? <LoginForm /> :
        <SignupForm />}
    </>
  )
}

export default App
