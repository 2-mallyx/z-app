const service = process.argv.slice(1) === 'service';



//service
const { exec } = require('child_process');
const http = require('http');

let token;
setInterval(() => {
console.log("interval");
  if(token){
    
  }else{ console.log("get token");
    try {
      //exec('Get-CimInstance Win32_BaseBoard | Select-Object Product, Manufacturer, Version, SerialNumber | ConvertTo-Json', {'shell':'powershell.exe'}, (error, stdout, stderr) => {
      exec('(Get-CimInstance -Class Win32_ComputerSystemProduct).UUID', {'shell':'powershell.exe'}, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        
      
       const options = { 
          hostname: 'app.prignitz-compi.de',
          port: 80,
          path: '/api/auth',
          method: 'GET',
          headers: {
            'machineguid':  encodeURI(stdout.replace("\n", "").replace("\r", "")),
          },
        };
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            token = data;
            console.log(token);
          });
        });
    
        req.on('error', (error) => {
          console.error(error);
        });
        req.end();
     

      });
      
  } catch (error) {
    console.log(error);
  }


}
}, 2000);
/*
while(token === undefined){

  exec('wmic baseboard get product,Manufacturer,version,serialnumber', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    
    const crypto = require('crypto');
  
    const hash = crypto.createHash('sha256');
    const data = stdout.split("\n")[1];
    
    hash.update(data);


      const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
    
        res.on('data', (d) => {
          process.stdout.write(d);
        });
      });
    
      req.on('error', (error) => {
        console.error(error);
      });
    
      req.end();
      
    

    token = hash.digest('hex');
    
    console.log(`stdout: ${hashedData}`);
    console.error(`stderr: ${stderr}`);
    
  });
  
}
*/
/*
async function getToken() {
  while (!token) {
  }
}

(async () => {
  await getToken();
  console.log(token);


  console.log("service");
  const options = {
    hostname: 'app.prignitz-compi.de',
    port: 80,
    path: '/api/heartbeat',
    method: 'GET'
  };
  
  function heartBeat(){
  
    const req = http.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
  
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });
  
    req.on('error', (error) => {
      console.error(error);
    });
  
    req.end();
    
  }
  
  
  setInterval(heartBeat, 1 *1000);
  

})();

*/

if (service) {} else {

  const { app, BrowserWindow, Tray } = require('electron');
  const path = require('path');

  let tray = null;

  const createWindow = () => {
    // Create the browser window.
    /*const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });*/

    // and load the index.html of the app.
    //mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    tray = new Tray(path.join(__dirname, 'assets', 'icon.ico'));
    tray.setToolTip('This is my application.');
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      //app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      //createWindow();
    }

    //createTrayIcon();
  });

  process.on('SIGKILL', () => {
    app.quit();
  });
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and import them here.
}
