export const validators = {
  required: v       => v.trim() !== '',
  email:    v       => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone:    v       => /^[\d\s\-().]{6,20}$/.test(v.trim()),
  minLen:   (v, n)  => v.length >= n,
};
