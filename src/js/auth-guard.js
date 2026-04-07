/* Este trecho de código JavaScript verifica se o valor armazenado no sessionStorage sob a chave
"wedding_auth_user" é falso (null, undefined, 0, false, etc.). Se o valor for falso, ele redireciona
o usuário para a página "index.html" com um parâmetro de consulta "login=necessario". Este código é
usado para reforçar a obrigatoriedade de login antes de acessar certas páginas ou recursos do site. */

if (!sessionStorage.getItem("wedding_auth_user")) {
  window.location.href = "index.html?login=necessario";
}
