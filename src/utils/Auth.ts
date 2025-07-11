export const isAdmin = (email: string, password: string) => {
  return (
    email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
    password === process.env.NEXT_PUBLIC_ADMIN_PASS
  );
};
