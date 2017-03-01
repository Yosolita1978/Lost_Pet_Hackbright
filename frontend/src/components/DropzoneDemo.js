import React from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';
import Dropzone from 'react-dropzone';
import request from 'superagent';

// remember put this in a secret file and in .gitignore
const CLOUDINARY_UPLOAD_PRESET = 'lostpets';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/lostpets/image/upload';

// This component make a especial zone for that allows the user upload a image

export default class DropzoneDemo extends React.Component{
    constructor(props){
        super(props);

        this.state = {uploading: false,
                      urlUpload: ""};

        this.onImageDrop = this.onImageDrop.bind(this);
    }


    onImageDrop(files){

        let file = files[0];

        let upload = request.post(CLOUDINARY_UPLOAD_URL)
                         .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                         .field('file', file);

        this.setState({uploading: true});
        this.props.onImageUploadStart();

        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }

            if (response.body.secure_url !== ''){

                console.log(response.body.secure_url);
        
                this.props.onImageUploaded(response.body.secure_url);
                this.setState({uploading: false,
                               urlUpload: response.body.secure_url});
            }


        });

    }

    render(){

        var message;

        if(this.state.uploading){
            message = "Uploading ...";
        } else {
            message = "Drop an image or click to select a file to upload";
        }

        var contentDropzone;
        if(!this.state.urlUpload){
            contentDropzone = (

                <Dropzone
                  onDrop={this.onImageDrop}
                  multiple={false}
                  accept="image/*"
                  size={150} >

                <div> { message }</div>
                </Dropzone>
            );
        } else{
            contentDropzone = (
                <div className="col-sm-3" >
                    <img src={this.state.urlUpload} />
                </div>
            );
        }

        return contentDropzone;
    }
}