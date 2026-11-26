/**
 * État de la double authentification (2FA) pour la session courante.
 * - hasFactor : l'utilisateur a au moins une application d'authentification validée
 *   (lu sur l'objet `user` renvoyé par le serveur d'auth, pas sur le cookie).
 * - aal2 : la session en cours a bien passé l'étape du code à 6 chiffres.
 * L'accès au back-office exige les deux.
 */
export async function getMfaState(supabase, user) {
  const hasFactor = (user?.factors || []).some(
    (f) => f.factor_type === "totp" && f.status === "verified"
  );
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return { hasFactor, aal2: data?.currentLevel === "aal2" };
}
