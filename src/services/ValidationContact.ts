import * as T from '../types';
function ValidationEmail(email: string) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
export function ValidationCreateContact(userData: T.ContactType) {
  var erros = [];
  if (userData.name.length < 3) {
    erros.push('Nome invalido');
  }
  if (ValidationEmail(userData.email) === false) {
    erros.push('Email invalido');
  }
  if (
    !(
      userData.telephones.number.length >= 8 &&
      userData.telephones.number.length <= 11
    )
  ) {
    erros.push('Numero de telefone invalido');
  }
  return erros;
}
