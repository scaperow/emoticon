import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('img')
  imageRef: ElementRef;

  constructor(public navCtrl: NavController, public http: Http) {

  }

  drawRectangle(x, y, w, h) {
    var img = document.getElementById('tracking-img');
    let rect = document.createElement('div');
    document.querySelector('#container').appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (img.offsetLeft + x) + 'px';
    rect.style.top = (img.offsetTop + y) + 'px';
  }

  getBase64Image(img) {
    console.log(img);
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    var dataURL = canvas.toDataURL();
    console.log(dataURL);
    return dataURL
  }
  dataURItoBlob = function (dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string  
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component  
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array  
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
      type: mimeString
    });
  }

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data;boundary=Ax43CXDer==3');

      let imageBase64 = this.getBase64Image(this.imageRef.nativeElement);
      console.log(imageBase64);
      let blob = this.dataURLtoBlob(imageBase64);

      let options = new RequestOptions({ headers: headers });
      let postData = {
        api_key: '8XAjz25_lcoUMtCgexLOhp5LlkBNfvGe',
        api_secret: 'Nc_Q-q8uXofylRNrhxccj6fyKZJ_HlXu',
        image_file: blob
        //image_url:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3906527860,4018815547&fm=27&gp=0.jpg'
      };

      let urlData = new FormData();
      for (var key in postData) {
        urlData.append(key, postData[key]);
      };

      this.http.post("/face-api/facepp/v3/detect?api_key=8XAjz25_lcoUMtCgexLOhp5LlkBNfvGe&api_secret=Nc_Q-q8uXofylRNrhxccj6fyKZJ_HlXu", urlData, options)
        .subscribe(data => {
          console.log(data);
        }, error => {
          console.log(error);
        });
    }, 2000);

    /*
    let $this = this;
    // Put here the code you want to execute
    let objects = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
    objects.on('track', function (event) {
      if (event.data.length === 0) {
        // No objects were detected in this frame.
        console.log('No objects were detected in this frame.');
      } else {
        event.data.forEach(rect => {
          //console.log(rect);
          $this.drawRectangle(rect.x, rect.y, rect.width, rect.height);
        });
      }
    });

    tracking.track('#tracking-img', objects);
    */
  }
}
