

// const button = document.querySelector('button');
// const text = document.querySelector('h1')


document.querySelector('input').addEventListener('change', function() {

    var reader = new FileReader();
    reader.onload = function() {
  
      var arrayBuffer = this.result,
        array = new Uint8Array(arrayBuffer),
        binaryString = String.fromCharCode.apply(null, array);
  
      console.log(binaryString);
  
    }
    reader.readAsArrayBuffer(this.files[0]);
  
  }, false);