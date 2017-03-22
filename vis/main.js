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

var HELPERS = {
    children: function(d) {
        return d.childScopes;
    },
    sum: function(d) {
        return 1;
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

create_packed_circle_tree();


function create_packed_circle_tree() {
    var padding = 10;

    var root = d3.hierarchy({childScopes:[]}, HELPERS.children)
        .sum( HELPERS.sum )

    var pack = d3.pack()
        .size([width, height])
        .padding(padding);

    pack(root);

    g.selectAll('circle')
        .data(root.descendants())
      .enter().append('circle')
        .attr('r', function(d) { return d.r; })
        .attr('fill', 'white' )
        .attr('stroke', 'black' )
        .attr('stroke-width', '1')
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y })
}