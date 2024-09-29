import React from 'react'
import { useNavigate } from 'react-router-dom' // Importando useNavigate
import './Login.css'

const Login: React.FC = () => {
  const navigate = useNavigate() // Inicializa o hook useNavigate

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Impede o comportamento padrão do formulário
    // Aqui você pode adicionar a lógica de autenticação, se necessário
    navigate('/home') // Redireciona para a tela de Home
  }

  return (
    <div className="login-modal">
      <div className="login-box">
        <h2>Entrar</h2>
        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <div className="register-link">
          <a href="/register">Cadastre-se</a>
        </div>
      </div>
    </div>
  )
}

export default Login
