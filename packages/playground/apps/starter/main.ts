/// <reference types="./env.d.ts" />
import '@blocksuite/blocks';
import '@blocksuite/editor';
import './components/start-panel';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import '@blocksuite/editor/themes/affine.css';

import { TestUtils } from '@blocksuite/blocks';
import { ContentParser } from '@blocksuite/blocks/content-parser';
import { AffineSchemas } from '@blocksuite/blocks/models';
import type { BlockSuiteRoot } from '@blocksuite/lit';
import type { DocProvider, Page } from '@blocksuite/store';
import { Job, Workspace } from '@blocksuite/store';

import { CustomNavigationPanel } from './components/custom-navigation-panel';
import { DebugMenu } from './components/debug-menu.js';
import type { InitFn } from './data';
import {
  createEditor,
  createWorkspaceOptions,
  defaultMode,
  initDebugConfig,
  initParam,
  isE2E,
  tryInitExternalContent,
} from './utils.js';

const options = createWorkspaceOptions();
initDebugConfig();

// Subscribe for page update and create editor after page loaded.
function subscribePage(workspace: Workspace) {
  workspace.slots.pageAdded.once(pageId => {
    if (typeof globalThis.targetPageId === 'string') {
      if (pageId !== globalThis.targetPageId) {
        // if there's `targetPageId` which not same as the `pageId`
        return;
      }
    }
    const app = document.getElementById('app');
    if (!app) {
      return;
    }
    const page = workspace.getPage(pageId) as Page;

    const editor = createEditor(page, app);
    const contentParser = new ContentParser(page);
    const debugMenu = new DebugMenu();
    const navigationPanel = new CustomNavigationPanel();

    debugMenu.workspace = workspace;
    debugMenu.editor = editor;
    debugMenu.mode = defaultMode;
    debugMenu.contentParser = contentParser;
    debugMenu.navigationPanel = navigationPanel;
    navigationPanel.editor = editor;
    document.body.appendChild(debugMenu);
    document.body.appendChild(navigationPanel);

    window.editor = editor;
    window.page = page;
  });
}

export async function initPageContentByParam(
  workspace: Workspace,
  param: string,
  pageId: string
) {
  const functionMap = new Map<
    string,
    (workspace: Workspace, id: string) => void
  >();
  Object.values(
    (await import('./data/index.js')) as Record<string, InitFn>
  ).forEach(fn => functionMap.set(fn.id, fn));
  // Load the preset playground documentation when `?init` param provided
  if (param === '') {
    param = 'preset';
  }

  // Load built-in init function when `?init=heavy` param provided
  if (functionMap.has(param)) {
    functionMap.get(param)?.(workspace, pageId);
    const page = workspace.getPage(pageId);
    await page?.waitForLoaded();
    page?.resetHistory();
    return;
  }

  // Try to load base64 content or markdown content from url
  await tryInitExternalContent(workspace, param, pageId);
}

async function main() {
  if (window.workspace) {
    return;
  }
  const workspace = new Workspace(options);
  window.workspace = workspace;
  window.job = new Job({ workspace });
  window.blockSchemas = AffineSchemas;
  window.Y = Workspace.Y;
  window.ContentParser = ContentParser;
  Object.defineProperty(globalThis, 'root', {
    get() {
      return document.querySelector('block-suite-root') as BlockSuiteRoot;
    },
  });

  const syncProviders = async (providers: DocProvider[]) => {
    for (const provider of providers) {
      if ('active' in provider) {
        provider.sync();
        await provider.whenReady;
      } else if ('passive' in provider) {
        provider.connect();
      }
    }
  };

  await syncProviders(workspace.providers);

  workspace.slots.pageAdded.on(async pageId => {
    const page = workspace.getPage(pageId) as Page;
    await page.waitForLoaded();
  });


      
  let $_GET = '';
  if(document.location.toString().indexOf('?') !== -1) {
      var query = document.location
                    .toString()
                    // get the query string
                    .replace(/^.*?\?/, '')
                    // and remove any existing hash string (thanks, @vrijdenker)
                    .replace(/#.*$/, '')
                    .split('&');

      for(var i=0, l=query.length; i<l; i++) {
        var aux = decodeURIComponent(query[i]).split('=');
        if(aux[0]=='taskflow')
        {
          $_GET=aux[1]
        }
      }
  }

  if (parseInt($_GET)>0) {
    /*await initCollaborationRequest(workspace, params.get('room') as string);*/
  let url = 'http://129.152.27.36/room.php';
  const intervalTime = 5000;


  // Create a timed anonymous autorun function
  const desotaUpdater = () => {
    
    
    localStorage.setObject('tfcache', {hash:0});
    localStorage.setObject('tfo', {tasks:[], subtasks:[]});
    localStorage.setItem('taskflow', $_GET);
    //let og = JSON.stringify({request:'taskflow', id:$_GET})



    const cyrb53 = (str : any, seed = 0) => {
      let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
      for(let i = 0, ch; i < str.length; i++) {
          ch = str.charCodeAt(i);
          h1 = Math.imul(h1 ^ ch, 2654435761);
          h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
      h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
      h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
    

    const fetchData = async () => {
      if (window.workspace && window.page && window.editor )
      {

        //localStorage.setItem('taskflow', JSON.stringify(meta));
        /*
        const mode = window.editor.mode === 'page' ? 'edgeless' : 'page';
        localStorage.setItem('playground:editorMode', mode);
        window.editor.mode = mode;
  */
        //window.page.awarenessStore.setReadonly(window.page, true);
        await window.page.waitForLoaded();
        window.page.getBlockByFlavour('affine:page')[0].id 
        let pageId = typeof window.page === 'undefined' ? "page0" : window.page.id;

        let og = JSON.stringify(window.workspace.exportPageSnapshot(pageId)) 
        if($_GET !== localStorage.getItem('taskflow'))
        {
          localStorage.setObject('tfcache', {hash:0});
          localStorage.setObject('tfo', {tasks:[], subtasks:[]});
          localStorage.setItem('taskflow', $_GET);
          og = JSON.stringify({request:'taskflow', id:$_GET})
        }

        og = JSON.stringify({request:'state', id:localStorage.getItem('tfcache')})

        fetch(url+"?r="+$_GET, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: og
        })
        .then(response => response.json())
        .then(data => {
          const parsedData = data;
  


          let ttc = {"hash":cyrb53(JSON.stringify(parsedData))};
          if(Object.keys(parsedData.tasks).length > 0 && localStorage.getObject('tfcache').hash !== ttc.hash)
          {
            let tasks = Object.keys(parsedData.tasks);
            let ldb = localStorage.getObject('tfo');
            var ldn: {[k: string]: any} = {};
            ldn.tasks = {};
            let pageId = eval('window.page.root.id');
            
            for( let i=1; i<(tasks.length + 1); i++ )
            {
              let cTask = parsedData.tasks[i];

              if(typeof ldb.tasks[i] == "undefined")
              {
                //Create the drawing of the TASK

                window.page.captureSync();
            
                const count = eval("window.page.root.children.length");
                const xywh = `[0,${count * 60},800,95]`;
            
                const noteId = window.page.addBlock('affine:note', { xywh }, pageId);
                const task_info = window.page.addBlock(
                  'affine:paragraph',
                  { type: "h2", text: new Text(cTask.task_type) },
                  noteId
                );
                const task_input = window.page.addBlock(
                  'affine:paragraph',
                  { type: "h3", text: new Text(cTask.input_args) },
                  noteId
                );
                
                cTask.ui_panel_element = noteId
                cTask.info_text_element = task_info
                cTask.input_text_element = task_input
                ldb.tasks[i]=cTask
              }
              else
              {
                const noteId = ldb.tasks[i].ui_panel_element
                const task_info = ldb.tasks[i].info_text_element 
                const task_input = ldb.tasks[i].input_text_element 
                cTask.ui_panel_element = noteId
                cTask.info_text_element = task_info
                cTask.input_text_element = task_input
                //Task type can change? Maybe one day here..
              }

              
              let subtasks = Object.keys(cTask.subtasks)
              for( let k=0; k<subtasks.length; k++ )
              {
                let cSubTask = parsedData.tasks[i].subtasks[k]
                if(typeof ldb.tasks[i] !== "undefined")
                {
                  if(typeof ldb.tasks[i].subtasks[k].output_text_element == "undefined")
                  {
                    //DRAW
                    console.log(":hi!")
                    window.page.captureSync();
                    const subtask_info = window.page.addBlock(
                      'affine:paragraph',
                      { type: "h3", text: new Text(cSubTask.task_type) },
                      cTask.ui_panel_element
                    );

                    //if(JSON.parse(cSubTask.output_args))
                    //{
                      let output=JSON.parse(cSubTask.output_args)
                      console.log(output)
                      if(typeof output.image !== "undefined")
                      {
                        console.log(output.image)
                        
                          //const storage = window.page.blobs;
                          const imgBlob = eval(`const fetchImg = async () => {
                          
                          //async() => { 
                          //try {
                            const resp = await fetch("http://129.152.27.36/assistant/api_uploads/`.trim()+output.image+`", {
                              cache: 'no-cache',
                              mode: 'cors',
                              headers: {
                                Origin: window.location.origin,
                              },
                            });
                            const imgBlob = await resp.blob();
                            /*if (!imgBlob.type.startsWith('image/')) {
                              throw new Error('Embed source is not an image');
                            }*/
                            console.log("Got Blob")
                            return imgBlob
                          /*} catch (e) {
                            console.error('Failed to fetch embed source');
                            console.error(e);
                            new Blob(['Error ' + e], {type: 'text/plain'});
                          }*/
                        }; fetchImg();`.trim())
                        let imgBlobId = async () => {await window.page.blobs.set(imgBlob)}
                        console.log(imgBlobId)
                        let subtask_output = eval("window.page.addBlock('affine:image', { sourceId:'"+ imgBlobId +"'}, window.page.getBlockById('"+cTask.ui_panel_element+"'));");
                    
                        cSubTask.output_text_element = subtask_output  
                      }
                      if(typeof output.text !== "undefined")
                      {
                        const subtask_output = window.page.addBlock(
                          'affine:paragraph',
                          { type: "text", text: new Text(cSubTask.output.text) },
                          cTask.ui_panel_element
                        );                        
                        cSubTask.output_text_element = subtask_output
                      }
                    //}
                      
                    cSubTask.info_text_element = subtask_info
                    cTask.subtasks[k] = cSubTask
                  }
                  else
                  {
                    //reassign to local DB
                    const subtask_info = ldb.tasks[i].subtasks[k].info_text_element
                    const subtask_output = ldb.tasks[i].subtasks[k].output_text_element
                    cSubTask.info_text_element = subtask_info
                    cSubTask.output_text_element = subtask_output
                    
                    //AND,. check for update!
                    if (ldb.tasks[i].subtasks[k].output_args !== cSubTask.output_args)
                    { 
                      try
                      {
                        eval ("window.page.updateBlock(window.page.getBlockById("+subtask_output+'), { type: "text", text: new Text("'+cSubTask.output_args+'") }')
                      }
                      catch(e)
                      {
                        console.warn(e)
                      }
                    }
                    
                    cTask.subtasks[k] = cSubTask
                      
                  }
                }
                    
              }  
                  
              ldn.tasks[i] = cTask
            }
            localStorage.setObject('tfcache', ttc);
            localStorage.setObject('tfo', ldn);
                
          }






          if (parsedData.method === 'applyUpdate') {
            // Trigger the import here
            console.log(parsedData.updateVal);
            let ng = JSON.parse(parsedData.updateVal)
            console.log(ng)
            //if(og !== JSON.stringify(ng))
            
            pageId = eval('window.page.root.id');

            window.page.captureSync();
        
            const count = eval('window.page.root.children.length');
            const xywh = `[0,${count * 60},800,95]`;
        
            const noteId = window.page.addBlock('affine:note', { xywh }, pageId);
            window.page.addBlock(
              'affine:paragraph',
              { type: "h2", text: new Text(`Paragraph type `) },
              noteId
            );
            //}
          }
          window.page.awarenessStore.setReadonly(window.page, false);
  
      });
    }
    else
    {
      console.warn("loading...")
    }
  };

// Call fetchData initially
fetchData();

// Set up the interval to call fetchData every 'intervalTime' milliseconds
setInterval(fetchData, intervalTime);
};


  // Execute the autorun function
  desotaUpdater();
  }

  });

  window.testUtils = new TestUtils();

  // In E2E environment, initial state should be generated by test case,
  // instead of using this default setup.
  if (isE2E) return;

  subscribePage(workspace);
  if (initParam !== null) {
    await initPageContentByParam(workspace, initParam, 'page0');
    return;
  }

  // Open default examples list when no `?init` param is provided
  //const exampleList = document.createElement('start-panel');
  //workspace.slots.pageAdded.once(() => exampleList.remove());
  //document.body.prepend(exampleList);
}

main();


Storage.prototype.setObject = function( key:any, value:any) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function( key:any ) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
}

