import * as d3 from 'd3';
import esprima from 'esprima';
import * as escope from 'escope';
import async from 'async';

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


var HELPERS = {
    children: function(d) {
        return d.childScopes;
    },
    sum: function(d) {

        var start = d.block.loc.start.line;
        var end = d.block.loc.end.line;

        return (end-start) + 1; //+1 so we do not have any 0
    }
}


var width = 800;
var height = 800;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('margin-left', 'auto')
    .style('margin-right', 'auto')
    .style('display', 'block')
    .style('margin-top', '50px');

var g = svg.append('g')
    //.attr('transform', (d) => { return `translate(${width/2},${height/2})` });

create_packed_circle_tree(
    {childScopes:[], block: {loc:{ start: { line: 1}, end: { line: 2 }}}},
    next
);

//-------------

function create_packed_circle_tree(data, cb) {
    var padding = 20;

    var tree = data;
    var id = 0;
    var root = d3.hierarchy(tree, HELPERS.children)
        .sum( HELPERS.sum )
        .each( function(d) {
            //console.log(d)
            //what would be the best ID for each element?
            d.key_id = id;
            id++;
        });

    var pack = d3.pack()
        .size([width, height])
        .padding(padding);

    pack(root);

    var transitionCount = 0;
    var transDur = 2000;
    var nextPause = 1000;

    // Join new data with old elements
    var nodes = g.selectAll('circle')
        .data(root.descendants(), function(d) {
            //console.log(d)
            return d.key_id;
        });

    // EXIT old elements not present in new data
    nodes.exit()
        .transition()
            .attr("r", function(d) {
                return 0;
            })
            .on('start', transStart)
            .on('end', transEnd)
            .duration(transDur)
        .remove();

    // UPDATE old elements present in new data
    nodes.transition()
        .attr("cx", function(d) {
            return d.x
        })
        .attr("cy", function(d) {
            return d.y
        })
        .attr("r", function(d) {
            return d.r
        })
        .on('start', transStart)
        .on('end', transEnd)
        .duration(transDur);

    // ENTER new elements present in new data
    nodes.enter().append('circle')
        .attr('r', function(d) { return 0; })
        .attr('fill', 'white' )
        .attr('stroke', 'black' )
        .attr('stroke-width', '1')
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y })
        .transition()
            .attr("r", function(d) {
                return d.r
            })
            .on('start', transStart)
            .on('end', transEnd)
            .duration(transDur);

    function transStart() {
        transitionCount++;
    }

    function transEnd() {
        transitionCount--;
        if(transitionCount === 0) {
            console.log('all endded')
            setTimeout(function() {
                cb();
            },nextPause)
        }
    }
}


function next() {
    console.log('nextCalled')
    //http://caolan.github.io/async/docs.html#timesSeries
    var tasks = [];

    files.forEach( (file) => {

        var task = function(callback) {
            step(file);
            callback(null);
        }

        tasks.push(task);
    })

    async.timesSeries(files.length, step, ()=> {
        console.log('done');
    })

    function step(n, cb) {

        d3.text('./data/underscore_' + files[n], function(res) {

            var ast = esprima.parse(res, {loc:true});
            var scopeManager = escope.analyze(ast,{ecmaVersion: 6});
            var global_scope = scopeManager.acquire(ast);

            //g.selectAll("*").remove();

            create_packed_circle_tree(global_scope,cb);
        });
    }
}
