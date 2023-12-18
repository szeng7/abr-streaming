// adapted from http://reference.dashif.org/dash.js/latest/samples/advanced/monitoring.html

var player1;
var player2;
var controlbar1;
var controlbar2;
const url = 'http://localhost:8000/Manifest.mpd'; //for local server start
const apiPort = 5000
const restAPI = `http://localhost:${apiPort}/`
// const url = 'http://10.0.0.2:8000/Manifest.mpd'; // for mininet
// const url = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd' //test cdn buffer changes only visible for larger videos 

// globals for the live plotting
var p1bitrate;
var p1buffersize;
var p2bitrate;
var p2buffersize;

function startVideo() {
    var video1 = document.querySelector(".videoContainer video");
    var video2 = document.querySelector(".videoContainer_2 video");

    player1 = dashjs.MediaPlayer().create();
    player2 = dashjs.MediaPlayer().create();

    player1.initialize(video1, url, true);
    player2.initialize(video2, url, true);

    controlbar1 = new ControlBar(player1);
    controlbar1.initialize();

    controlbar2 = new ControlBar(player2);
    controlbar2.initialize('_2');

    player1.on(dashjs.MediaPlayer.events["PLAYBACK_ENDED"], function() {
        clearInterval(pollStats1);
        clearInterval(estimateBitrate1);
    });
    player2.on(dashjs.MediaPlayer.events["PLAYBACK_ENDED"], function() {
        clearInterval(pollStats2);
        clearInterval(estimateBitrate2);
    });
    var pollStats1 = setInterval(function() {
        var streamInfo1 = player1.getActiveStream().getStreamInfo();
        var dashMetrics1 = player1.getDashMetrics();
        var dashAdapter1 = player1.getDashAdapter();
        const periodId1 = streamInfo1.index;
        var repId1 = dashMetrics1.getCurrentRepresentationSwitch('video', true).to;
        var bitrate1 = Math.round(dashAdapter1.getBandwidthForRepresentation(repId1, periodId1) / 1000)
        var bufferLevel1 = dashMetrics1.getCurrentBufferLevel('video', true);
        console.log(player1.getAverageThroughput("video"));
        document.getElementById('reportedBitrate1').innerText = bitrate1 + " Kbps";
        document.getElementById('bufferLevel1').innerText = bufferLevel1 + " sec";
        // for live plotting
        p1buffersize = bufferLevel1;
        // var repId1_1 = dashMetrics1.getCurrentRepresentationSwitch('video', true);
        // p1bitrate = repId1_1 ? Math.round(dashAdapter1.getBandwidthForRepresentation(repId1.to, periodId1) / 1000): NaN;
    }, 1000);


    var pollStats2 = setInterval(function() {
        var streamInfo2 = player2.getActiveStream().getStreamInfo();
        var dashMetrics2 = player2.getDashMetrics();
        var dashAdapter2 = player2.getDashAdapter();
        const periodId2 = streamInfo2.index;
        var repId2 = dashMetrics2.getCurrentRepresentationSwitch('video', true).to;
        var bitrate2 = Math.round(dashAdapter2.getBandwidthForRepresentation(repId2, periodId2) / 1000)
        var bufferLevel2 = dashMetrics2.getCurrentBufferLevel('video', true);
        console.log(player2.getAverageThroughput('video'));
        document.getElementById('reportedBitrate2').innerText = bitrate2 + " Kbps";
        document.getElementById('bufferLevel2').innerText = bufferLevel2 + " sec";
        // for live plotting
        p2buffersize = bufferLevel2;
        // p2bitrate = repId2 ? Math.round(dashAdapter2.getBandwidthForRepresentation(repId2, periodId2) / 1000): NaN;
    }, 1000);

    if (video1.webkitVideoDecodedByteCount != undefined) {
        var numBytesPrev = 0;
        const timeElapsed = 5; 
        var estimateBitrate1 = setInterval(function() {
            var calculatedBitrate = (((video1.webkitVideoDecodedByteCount - numBytesPrev) / 1000) * 8) / timeElapsed;
            document.getElementById('calculatedBitrate1').innerText = Math.round(calculatedBitrate) + " Kbps";
            numBytesPrev = video1.webkitVideoDecodedByteCount;
            // for live graphing 
            p1bitrate = calculatedBitrate;
        }, timeElapsed * 1000);
    }

    if (video2.webkitVideoDecodedByteCount != undefined) {
        var numBytesPrev2 = 0;
        const timeElapsed2 = 5;
        var estimateBitrate2 = setInterval(function() {
            var calculatedBitrate2 = (((video2.webkitVideoDecodedByteCount - numBytesPrev2) / 1000) * 8) / timeElapsed2;
            document.getElementById('calculatedBitrate2').innerText = Math.round(calculatedBitrate2) + " Kbps";
            numBytesPrev2 = video2.webkitVideoDecodedByteCount;
            // for live graphing
            p2bitrate = calculatedBitrate2;
        }, timeElapsed2 * 1000);
    } 
}

function configurePlayback(inp) {
    var controlbar;
    var player;
    var stableBuffer;
    var bufferAtTopQuality;
    var minBitrate;
    var maxBitrate;
    var abr;
    var changeAbr;
    if(inp == 1){
        player = player1
        controlbar = controlbar1
        stableBuffer = parseInt(document.getElementById('stableBuffer1').value, 10);
        bufferAtTopQuality = parseInt(document.getElementById('topQualityBuffer1').value, 10);
        minBitrate = parseInt(document.getElementById('minBitrate1').value, 10);
        maxBitrate = parseInt(document.getElementById('maxBitrate1').value, 10);
        abr = document.getElementById('abr1').value;
        changeAbr = document.getElementById('changeabr1').checked;
        
    }
    if(inp == 2){
        player = player2
        controlbar = controlbar2
        stableBuffer = parseInt(document.getElementById('stableBuffer2').value, 10);
        bufferAtTopQuality = parseInt(document.getElementById('topQualityBuffer2').value, 10);
        minBitrate = parseInt(document.getElementById('minBitrate2').value, 10);
        maxBitrate = parseInt(document.getElementById('maxBitrate2').value, 10);
        abr = document.getElementById('abr2').value;
        changeAbr = document.getElementById('changeabr2').checked;
    }

    start_graph(inp, true);

    console.log(bufferAtTopQuality)
    player1.updateSettings({
        'streaming': {
            'stableBufferTime': stableBuffer,
            'bufferTimeAtTopQualityLongForm': bufferAtTopQuality,
            'abr': {
                'minBitrate': {
                    'video': minBitrate
                },
                'maxBitrate': {
                    'video': maxBitrate
                }
            }
        }
    })
    if(changeAbr){
        switch(abr){
            case 'LowestBitrateRule':
                player.removeAllABRCustomRule();
                player.addABRCustomRule('qualitySwitchRules', 'LowestBitrateRule', LowestBitrateRule);
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': false,
                            'ABRStrategy': 'LowestBitrateRule'
                        }
                    }
                });
                break;
            case 'DownloadRatioRule':
                player.removeAllABRCustomRule();
                player.addABRCustomRule('qualitySwitchRules', 'DownloadRatioRule', DownloadRatioRule);
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': false,
                            'ABRStrategy': 'DownloadRatioRule'
                        }
                    }
                });
                break;
            case 'ThroughputRule':
                player.removeAllABRCustomRule();
                player.addABRCustomRule('qualitySwitchRules', 'ThroughputRule', CustomThroughputRule);
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': false,
                            'ABRStrategy': 'ThroughputRule'
                        }
                    }
                });
                break;
            case 'HighestBitrateRule':
                    player.removeAllABRCustomRule();
                    player.addABRCustomRule('qualitySwitchRules', 'HighestBitrateRule', HighestBitrateRule);
                    player.updateSettings({
                        'streaming': {
                            'abr': {
                                'useDefaultABRRules': false,
                                'ABRStrategy': 'HighestBitrateRule'
                            }
                        }
                    });
                    break;
            case 'RLRule':
                player.removeAllABRCustomRule();
                player.addABRCustomRule('qualitySwitchRules', 'RLRule', RLRule);
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': false,
                            'ABRStrategy': 'RLRule'
                        }
                    }
                });
                break;
            default:
                player.removeAllABRCustomRule();
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': true,
                        }
                    }
                });
        }
        player.attachSource(url);
        controlbar.reset();
    }
}

// Use for flask testing
function callPyScript(){
    var input = {'a': 'b', 'c': [1,2,3]}
    var getPy = $.ajax({
        type: "POST",
        url: restAPI + "testABR",
        async: false,
        crossDomain:true,
        data: { mydata: JSON.stringify(input) }
    });

    console.log(getPy.responseText)
    
}

var xaxis_count = 1;
function start_graph(player_num, is_change) {
    var layout1 = {
        title: 'Player 1 Stats',
        xaxis: {
        title: 'Time elapsed (s)',
        },
        yaxis: {title: 'Bitrate (kbps)', autoscale: true},
        yaxis2:{
            title:'Buffer level (s)',
            overlaying: 'y',
            side:'right',
            autoscale:true
        }
    };

    var traces1 = [{
        y:[getData()],
        yaxis:'y1',
        xaxis:'x' + xaxis_count,
        type:'line',
        name:'Bitrate (kbps)'
        }, {
        y:[getData1()],
        yaxis:'y2',
        xaxis:'x' + xaxis_count,
        type:'line',
        name:'Buffer Size (s)'
    }];

    if (player_num == 1 && is_change == false){
        Plotly.plot('chart', traces1, layout1);
        setInterval1();

    } else if (player_num == 1 && is_change == true){
        Plotly.newPlot('chart', traces1, layout1);
        setInterval1();
    }

    var layout2 = {
        title: 'Player 2 Stats',
        xaxis2: {title: 'Time elapsed (s)'},
        yaxis3: {title: 'Bitrate (kbps)', autoscale: true},
        yaxis4:{
            title:'Buffer level (s)',
            overlaying: 'y3',
            side:'right',
            autoscale:true
        }
    };

    var traces2 = [{
                        y:[getData3()],
                        yaxis:'y3',
                        xaxis:'x' + xaxis_count,
                        type:'line',
                        name:'Bitrate (kbps)'
                    }, {
                        y:[getData4()],
                        yaxis:'y4',
                        xaxis:'x' + xaxis_count,
                        type:'line',
                        name:'Buffer Size (s)'
                    }]

    if (player_num == 2 && is_change == false){
        Plotly.plot('chart2', traces2, layout2);
        setInterval2();

    } else if (player_num == 2 && is_change == true){
        Plotly.newPlot('chart2', traces2, layout2);
        setInterval2();
    }
    // if the xaxis isn't reinstantiated on an update, the graph is off-centered
    xaxis_count++;
}

function setInterval1(){
    var count=0;

    setInterval(function(){
        Plotly.extendTraces('chart',{
            y:[[getData()], [getData1()]]},[0,1]);
            count++;

            if(count > 30) {
                Plotly.relayout('chart',{
                    xaxis: {
                        range:[count-30,count]
                    }
                })
            }
    },1000);
}

function setInterval2(){
    var count1 = 0;
    setInterval(function(){
        Plotly.extendTraces('chart2',{
            y:[[getData3()], [getData4()]]},[0,1]);
            count1++;

            if(count1 > 30) {
                Plotly.relayout('chart2',{
                    xaxis2: {
                    range:[count1-30,count1]
                    }
                })
            }
    },1000);
}

function getData() {
    var bitratenow = p1bitrate;
    if (bitratenow < 0) {
        return 0;
    }
    return bitratenow;
    // return p1bitrate;
}

function getData1() {
    //return player1.dashMetrics1.getCurrentBufferLevel('video', true);
                        
    return p1buffersize;
}

function getData3() {
    var bitratenow = p2bitrate;
    if (bitratenow < 0){
        return 0;
    } 
    return bitratenow;

    // return p2bitrate;
}

function getData4() {
    // return player2.dashMetrics2.getCurrentBufferLevel('video', true);
    return p2buffersize;
}

