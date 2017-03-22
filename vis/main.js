import * as d3 from 'd3';
import esprima from 'esprima';
import * as escope from 'escope';

// 1) load the source code file
// 2) parse the file using esprima and escope
// 3) visualise the scope chain tree using d3 parcked circle layout

var files = [
'1.1.1.js',
'1.1.2.js',
'1.1.3.js',
'1.1.4.js',
'1.1.5.js',
'1.1.6.js',
'1.1.7.js',
'1.2.0.js',
'1.2.1.js',
'1.2.2.js',
'1.2.3.js',
'1.2.4.js',
'1.3.0.js',
'1.3.1.js',
'1.3.2.js',
'1.3.3.js',
'1.4.0.js',
'1.4.1.js',
'1.4.2.js',
'1.4.3.js',
'1.4.4.js',
'1.5.0.js',
'1.5.1.js',
'1.5.2.js',
'1.5.2.js',
'1.6.0.js',
'1.7.0.js',
'1.8.0.js',
'1.8.1.js',
'1.8.2.js',
'1.8.3.js'
];


function create_packed_circle_tree() {
    
}