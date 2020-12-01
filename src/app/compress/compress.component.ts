import { Component, OnInit } from '@angular/core';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as imageConversion from 'image-conversion';

@Component({
  selector: 'app-compress',
  templateUrl: './compress.component.html',
  styleUrls: ['./compress.component.scss']
})
export class CompressComponent implements OnInit {

  image: any;
  defaultQuality = 0.8;
  uploadedFiles: Array<File> = [];
  processedImages: Array<any> = [];
  public multiple: boolean = true;
  public fileUploadControl = new FileUploadControl().setListVisibility(false);

  constructor(
    private modalService: NgbModal
  ) {

  }

  ngOnInit(): void {
    this.fileUploadControl.valueChanges.subscribe(() => {
      this.setUpDataToProcess();
    });
  }

  public clear(): void {
    this.fileUploadControl.setValue([]);
  }

  setUpDataToProcess() {

    this.fileUploadControl.value.map((image: any, index: number) => {

      if (!image.isCompressed) {
        let dataSetUp = {
          file: image,
          fileSize: this.formatBytes(image.size),
          generatedImage: null,
          compressedImage: null,
          compressedImageSize: null,
          compressedPercentage: null,
          // quality: this.quality,
          // ratio: this.ratio,
          updateDefaultConfiguration: false,
          isCompressed: false,
          index: index,
          compressPercentageCompleted: null,
        };

        let reader = new FileReader();
        reader.readAsDataURL(image); // read file as data url

        reader.onloadend = (event) => { // called once readAsDataURL is completed
          dataSetUp.generatedImage = reader.result;
          dataSetUp.isCompressed = true;
          image.isCompressed = true;

          this.getOrientation(image, (orientation) => {

            this.compressImage(image, orientation, dataSetUp, this.defaultQuality)

          });
        };

        this.processedImages.push(dataSetUp);
      }
    });
  }

  compressImage(image, orientation, dataSetUp, quality) {
    imageConversion.compress(image, {
      quality: quality,
      orientation: orientation
    }).then(compressedBlobImage => {

      let innerReader = new FileReader();

      innerReader.onloadend = () => {

        const differenceOfSize = Number(dataSetUp.file.size) - compressedBlobImage.size;

        if (differenceOfSize > 0) {
          dataSetUp.compressedImage = innerReader.result;
          dataSetUp.compressedImageSize = this.formatBytes(compressedBlobImage.size);

          dataSetUp.compressedPercentage = ((differenceOfSize / Number(dataSetUp.file.size)) * 100).toFixed(2);
        }
        else {
          //  Compress Image With More Less Quantity If No Difference Found
          this.compressImage(image, orientation, dataSetUp, quality - 0.1);
        }
      }

      innerReader.readAsDataURL(compressedBlobImage);

    });
  }


  b64toBlob(dataURI, type) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: type });
  }

  getFileSizeInMB(sizeInBytes: number) {
    return (sizeInBytes / (1024 * 1024));
  }

  formatBytes(bytes) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 2; // Change as required

    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    // var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if (bytes < kiloBytes) return { size: bytes, type: "Bytes" };
    // return KB if less than a MB
    else if (bytes < megaBytes) return { size: (bytes / kiloBytes).toFixed(decimal), type: "KB" };
    // return MB if less than a GB
    else if (bytes < gigaBytes) return { size: (bytes / megaBytes).toFixed(decimal), type: "MB" };
    // return GB if less than a TB
    else return { size: (bytes / gigaBytes).toFixed(decimal), type: "GB" };
  }

  getOrientation = (file: File, callback: Function) => {
    var reader = new FileReader();

    reader.onload = (event: ProgressEvent) => {

      if (!event.target) {
        return;
      }

      const file = event.target as FileReader;
      const view = new DataView(file.result as ArrayBuffer);

      if (view.getUint16(0, false) != 0xFFD8) {
        return callback(-2);
      }

      const length = view.byteLength
      let offset = 2;

      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
        let marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
            return callback(-1);
          }

          let little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          let tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + (i * 12), little) == 0x0112) {
              return callback(view.getUint16(offset + (i * 12) + 8, little));
            }
          }
        } else if ((marker & 0xFF00) != 0xFF00) {
          break;
        }
        else {
          offset += view.getUint16(offset, false);
        }
      }
      return callback(-1);
    };

    reader.readAsArrayBuffer(file);
  }

  getOrientationNew(imageFile: File, onRotationFound: (rotationInDegrees: number) => void) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      if (!event.target) {
        return;
      }

      const innerFile = event.target as FileReader;
      const view = new DataView(innerFile.result as ArrayBuffer);

      if (view.getUint16(0, false) !== 0xffd8) {
        return onRotationFound(this.convertRotationToDegrees(-2));
      }

      const length = view.byteLength;
      let offset = 2;

      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) {
          return onRotationFound(this.convertRotationToDegrees(-1));
        }
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return onRotationFound(this.convertRotationToDegrees(-1));
          }

          const little = view.getUint16((offset += 6), false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              return onRotationFound(this.convertRotationToDegrees(view.getUint16(offset + i * 12 + 8, little)));
            }
          }
          // tslint:disable-next-line:no-bitwise
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      return onRotationFound(this.convertRotationToDegrees(-1));
    };
    reader.readAsArrayBuffer(imageFile);
  }

  /**
   * Based off snippet here: https://github.com/mosch/react-avatar-editor/issues/123#issuecomment-354896008
   * @param rotation converts the int into a degrees rotation.
   */
  convertRotationToDegrees(rotation: number): number {
    let rotationInDegrees = 0;
    switch (rotation) {
      case 8:
        rotationInDegrees = 270;
        break;
      case 6:
        rotationInDegrees = 90;
        break;
      case 3:
        rotationInDegrees = 180;
        break;
      default:
        rotationInDegrees = 0;
    }
    return rotationInDegrees;
  }

}
