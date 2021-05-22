#!/usr/bin/env node

const prompts = require('prompts');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const https = require('https');
const chalk = require('chalk');

const working_dir = process.cwd();
const release_url = "https://github.com/Triophore/kepler/releases/download/v0.01-aplha-for-testing/kepler.zip";

const cliProgress = require('cli-progress');

// create a new progress bar instance and use shades_classic theme
var bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);



async function create_kepler_project(){
 var downpath = path.join(working_dir,'temp');
    if (!fs.existsSync(downpath)){
    fs.mkdirSync(downpath);
    }
    download_kepler_files(release_url,downpath)
}


create_kepler_project();

async function download_kepler_files(url,dpath){
    const Downloader = require('nodejs-file-downloader');
    bar1.start(100, 0);
    const downloader = new Downloader({     
        url: url,     
        directory:dpath ,//"./downloads/2020/May",//Sub directories will also be automatically created if they do not exist.  
        onProgress:function(percentage,chunk,remainingSize){//Gets called with each chunk.
            update(parseInt(percentage))
            
        }         
      })    
     
     try {
      
       await downloader.download();   
       bar1.stop();
       extract_kepler_project( path.join(working_dir,'temp','kepler.zip'),path.join(working_dir,'temp','dist'))
     } catch (error) {
        console.log(error)
        bar1.stop();

        
     }finally{
        bar1.stop();
     }
}

function update(percentage){
    bar1.update(percentage);
}

function extract_kepler_project(file,target){
    const extract = require('progress-extract');
    extract(file, target)
    .then(() => {
        var cmd =  `
        cd `+path.join(working_dir,'temp','dist')+`
        npm install `
        
        var exec = require('child_process').execSync,
            child;

        child = exec('npm install',
            {
                cwd: path.join(working_dir,'temp','dist'),
                stdio: 'inherit'
            });

       
    }, err => {
        console.log('extract failed')
    })
}