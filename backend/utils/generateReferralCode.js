module.exports = function generateReferralCode(name = 'USR') {
  const base = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${rand}`;
};
