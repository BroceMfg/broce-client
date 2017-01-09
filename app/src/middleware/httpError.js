export default (cb) => {
  console.log('error: network function errored.');
  cb('Error: Please try again.');
  setTimeout(() => cb, 3000);
}