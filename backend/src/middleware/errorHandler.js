module.exports = (err, req, res, next) => {
  console.error('❌ Error:', err);

  if (err.code === 'P2002')
    return res.status(409).json({ success: false, message: 'Duplicate entry: ' + err.meta?.target });

  if (err.code === 'P2025')
    return res.status(404).json({ success: false, message: 'Record not found' });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};