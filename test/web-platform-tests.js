var fs = require('fs');
var assert = require('assert');
var Path = require('path');
var domino = require('../lib');

// These are the tests we currently fail.
// Some of these failures are bugs we ought to fix.
var blacklist = [
  // web-platform-tests/html/dom
  'interfaces',
  'documents dom-tree-accessors Document.body',
  'documents dom-tree-accessors Document.currentScript.sub',
  'documents dom-tree-accessors document.embeds-document.plugins-01',
  'documents dom-tree-accessors document.forms',
  'documents dom-tree-accessors document.images',
  'documents dom-tree-accessors document.title-05',
  'documents dom-tree-accessors document.title-07',
  'documents dom-tree-accessors document.title-09',
  'documents dom-tree-accessors nameditem-01',
  'documents dom-tree-accessors nameditem-02',
  'documents dom-tree-accessors nameditem-03',
  'documents dom-tree-accessors nameditem-04',
  'documents dom-tree-accessors nameditem-05',
  'documents dom-tree-accessors nameditem-06',
  'documents dom-tree-accessors document.getElementsByName document.getElementsByName-interface',
  'documents dom-tree-accessors document.getElementsByName document.getElementsByName-namespace-xhtml',
  'documents dom-tree-accessors document.getElementsByName document.getElementsByName-namespace',
  'documents resource-metadata-management document-compatmode-06',
  'documents resource-metadata-management document-cookie',
  'documents resource-metadata-management document-lastModified-01',
  'documents resource-metadata-management document-lastModified',
  'dynamic-markup-insertion closing-the-input-stream document.close-01',
  /dynamic-markup-insertion document-write [0-9]+/,
  /dynamic-markup-insertion document-write document.write-0[12]/,
  /dynamic-markup-insertion document-write iframe_00[0-9]/,
  /dynamic-markup-insertion document-write script_00[2456789]/,
  /dynamic-markup-insertion document-write script_01[0123]/,
  /dynamic-markup-insertion document-writeln document.writeln-0[123]/,
  /dynamic-markup-insertion opening-the-input-stream 00[12789]/,
  'dynamic-markup-insertion opening-the-input-stream 010-2',
  /dynamic-markup-insertion opening-the-input-stream 01[123456]-1/,
  'dynamic-markup-insertion opening-the-input-stream document.open-01',
  'dynamic-markup-insertion opening-the-input-stream document.open-02',
  'dynamic-markup-insertion opening-the-input-stream document.open-03-frame',
  'elements global-attributes custom-attrs',
  'elements global-attributes data_unicode_attr',
  'elements global-attributes dataset-delete',
  'elements global-attributes dataset-enumeration',
  'elements global-attributes dataset-get',
  'elements global-attributes dataset-prototype',
  'elements global-attributes dataset-set',
  'elements global-attributes dataset',
  'elements global-attributes dir_auto-contained-script-L-ref',
  'elements global-attributes dir_auto-contained-script-L',
  'elements global-attributes id-attribute',
  'elements global-attributes the-lang-attribute-001',
  'elements global-attributes the-lang-attribute-002',
  'elements global-attributes the-lang-attribute-003',
  'elements global-attributes the-lang-attribute-004',
  'elements global-attributes the-lang-attribute-005',
  'elements global-attributes the-lang-attribute-006',
  'elements global-attributes the-lang-attribute-007',
  'elements global-attributes the-lang-attribute-008',
  'elements global-attributes the-lang-attribute-009',
  'elements global-attributes the-lang-attribute-010',
  'elements global-attributes the-translate-attribute-007',
  'elements global-attributes the-translate-attribute-008',
  'elements global-attributes the-translate-attribute-009',
  'elements global-attributes the-translate-attribute-010',
  'elements global-attributes the-translate-attribute-011',
  'elements global-attributes the-translate-attribute-012',
  'reflection-embedded',
  'reflection-forms',
  'reflection-grouping',
  'reflection-metadata',
  'reflection-misc',
  'reflection-obsolete',
  'reflection-sections',
  'reflection-original',
  'reflection-tabular',
  'reflection-text',
  
  // web-platform-tests/dom/nodes
  'CharacterData-appendChild',
  'CharacterData-appendData',
  'CharacterData-data',
  'CharacterData-deleteData',
  'CharacterData-insertData',
  'CharacterData-remove',
  'CharacterData-replaceData',
  'CharacterData-substringData',
  'ChildNode-after',
  'ChildNode-before',
  'ChildNode-replaceWith',
  'Comment-constructor',
  'DOMImplementation-createDocument',
  'DOMImplementation-createDocumentType',
  'DOMImplementation-createHTMLDocument',
  'DOMImplementation-hasFeature',
  'Document-URL.sub',
  'Document-adoptNode',
  'Document-characterSet-normalization',
  'Document-constructor',
  /Document-contentType/,
  'Document-createAttribute',
  'Document-createComment',
  'Document-createElement-namespace',
  'Document-createElement',
  'Document-createElementNS',
  'Document-createEvent',
  'Document-createProcessingInstruction',
  'Document-createTreeWalker',
  'Document-getElementById',
  'Document-getElementsByTagName',
  'Document-getElementsByTagName-xhtml',
  'Document-getElementsByTagNameNS',
  'Document-importNode',
  'DocumentType-remove',
  'Element-childElement-null-xhtml',
  'Element-childElementCount-dynamic-add-xhtml',
  'Element-childElementCount-dynamic-remove-xhtml',
  'Element-childElementCount-nochild-xhtml',
  'Element-childElementCount-xhtml',
  'Element-children',
  'Element-classlist',
  'Element-closest',
  'Element-firstElementChild-entity-xhtml',
  'Element-firstElementChild-xhtml',
  'Element-firstElementChild-namespace-xhtml',
  'Element-getElementsByClassName',
  'Element-getElementsByTagName-change-document-HTMLNess',
  'Element-getElementsByTagName',
  'Element-getElementsByTagNameNS',
  'Element-hasAttributes',
  'Element-insertAdjacentElement',
  'Element-insertAdjacentText',
  'Element-lastElementChild-xhtml',
  'Element-matches',
  'Element-nextElementSibling-xhtml',
  'Element-previousElementSibling-xhtml',
  'Element-remove',
  'Element-removeAttributeNS',
  'Element-siblingElement-null-xhtml',
  'Element-tagName',
  'MutationObserver-attributes',
  'MutationObserver-characterData',
  'MutationObserver-childList',
  'MutationObserver-disconnect',
  'MutationObserver-document',
  'MutationObserver-inner-outer',
  'MutationObserver-takeRecords',
  'Node-appendChild',
  'Node-baseURI',
  'Node-childNodes',
  'Node-cloneNode',
  'Node-compareDocumentPosition',
  'Node-constants',
  'Node-insertBefore',
  'Node-isConnected',
  'Node-isEqualNode',
  'Node-isEqualNode-xhtml',
  'Node-isSameNode',
  'Node-lookupPrefix',
  'Node-lookupNamespaceURI',
  'Node-nodeName-xhtml',
  'Node-nodeValue',
  'Node-parentNode-iframe',
  'Node-parentNode',
  'Node-properties',
  'Node-removeChild',
  'Node-replaceChild',
  'Node-textContent',
  'NodeList-Iterable',
  'ParentNode-append',
  'ParentNode-prepend',
  'ParentNode-querySelector-All-content',
  'ParentNode-querySelector-All',
  /ProcessingInstruction/,
  'Text-constructor',
  'append-on-Document',
  'attributes',
  'case',
  'insert-adjacent',
  'prepend-on-Document',
  'remove-unscopable',
  'rootNode',
].map(function(s) {
  // Convert strings to equivalent regular expression matchers.
  if (typeof s === 'string') {
    return new RegExp('^' + s.replace(/[\^\\$*+?.()|{}\[\]\/]/g, '\\$&') + '$');
  } else {
    return s;
  }
});

var onBlacklist = function(name) {
  name = name.replace(/\//g, ' ').replace(/\.x?html$/, '');
  for (var i=0; i<blacklist.length; i++) {
    if (blacklist[i].test(name)) { return true; }
  }
  return false;
};

function read(file) {
  return fs.readFileSync(Path.resolve(__dirname, '..', file), 'utf8');
}

var testRoot = Path.join(__dirname, "web-platform-tests");

function mapFilesIn(base, dir, fn) {
  var result = {};
  var fulldir = Path.resolve(__dirname, '..', base, dir);
  fs.readdirSync(fulldir).forEach(function(file) {
    var path = Path.join(dir, file);
    var stat = fs.statSync(Path.join(fulldir, file));
    if (stat.isDirectory()) {
      result[file] = mapFilesIn(base, path, fn);
    }
    else if (file.match(/\.x?html$/)) {
      var test = fn(path, Path.join(fulldir, file));
      if (test) result[file] = test;
    }
  });
  return result;
}

var harness = function() {
  var paths = [].slice.call(arguments);
  return paths.map(function (path) {
    return mapFilesIn(path, '', function(name, file) {      
      var html = read(file);
      var window = domino.createWindow(html);
      var scripts = window.document.getElementsByTagName('script');
      var scriptContent = [].map.call(scripts, (s) => getScriptContents(file, s));

      return function runTest() {
        try {
          scriptContent.forEach((content) => window._run(content));
          window._run("\n(" + buildResultListener(name).toString() + ")();");
          window._run("\nwindow.dispatchEvent(new Event('load'));");
        } catch (e) {
          if ((!onBlacklist(name)) ||
              /^Expected blacklisted test to fail/.test(e.message||'')) {
            throw e;
          }
        }
      };
    })
  });
};

function getScriptContents(htmlFilePath, scriptTag) {
  if (/^text\/plain$/.test(scriptTag.getAttribute('type')||'')) {
    return '';
  } else if (scriptTag.getAttribute("src")) {
    var src = scriptTag.getAttribute("src");
    if (/^data:/.test(src)) {
      if (/^data:text\/plain,/.test(src)) {
        return src.substring(16);
      } else {
        throw new Error("Script src specified with unknown data encoding");
      }
    } else {
      var scriptPath = src[0] === "/" ?
          Path.resolve(testRoot, src.substring(1)) :
          Path.resolve(Path.dirname(htmlFilePath), src);
      if (!fs.existsSync(scriptPath) || fs.statSync(scriptPath).isDirectory()) {
        console.error(htmlFilePath, "requested", src, "which resolved to missing file: ", scriptPath);
        return "";
      } else {
        return fs.readFileSync(scriptPath, 'utf8') + '\n//@ sourceURL=' + src;
      }
    }
  } else {
    return scriptTag.textContent;
  }
}

function buildResultListener(testName) {
  return onBlacklist(testName) ? function listenForSuccess() {
    if (!window.add_completion_callback) return;
    add_completion_callback(function(tests, status) {
      var failed = tests.filter(function(t) {
        return t.status === t.FAIL || t.status === t.TIMEOUT;
      });
      if (failed.length===0) {
        throw new Error("Expected blacklisted test to fail");
      }
    });
  } : function listenForFailures() {
    if (!window.add_completion_callback) return;
    add_completion_callback(function(tests, status) {
      var failed = tests.filter(function(t) {
        return t.status === t.FAIL || t.status === t.TIMEOUT;
      });
      if (failed.length) {
        throw new Error(failed[0].name+": "+failed[0].message);
      }
    });
  };
}

module.exports = harness(__dirname + '/web-platform-tests/html/dom',
                         __dirname + '/web-platform-tests/dom/nodes');
