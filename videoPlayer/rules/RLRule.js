var HighestBitrateRule;
var startRebufferTime = 0;
var endRebufferTime = 0;
var startRebufferCalc = false;
var currentRebufferTime = 0;
var lastReq = 0;
var chunkSize = 0;
var leftOverChunks = 0;
var size_video1 = [2354772, 2123065, 2177073, 2160877, 2233056, 1941625, 2157535, 2290172, 2055469, 2169201, 2173522, 2102452, 2209463, 2275376, 2005399, 2152483, 2289689, 2059512, 2220726, 2156729, 2039773, 2176469, 2221506, 2044075, 2186790, 2105231, 2395588, 1972048, 2134614, 2164140, 2113193, 2147852, 2191074, 2286761, 2307787, 2143948, 1919781, 2147467, 2133870, 2146120, 2108491, 2184571, 2121928, 2219102, 2124950, 2246506, 1961140, 2155012, 1433658],
size_video2 = [1728879, 1431809, 1300868, 1520281, 1472558, 1224260, 1388403, 1638769, 1348011, 1429765, 1354548, 1519951, 1422919, 1578343, 1231445, 1471065, 1491626, 1358801, 1537156, 1336050, 1415116, 1468126, 1505760, 1323990, 1383735, 1480464, 1547572, 1141971, 1498470, 1561263, 1341201, 1497683, 1358081, 1587293, 1492672, 1439896, 1139291, 1499009, 1427478, 1402287, 1339500, 1527299, 1343002, 1587250, 1464921, 1483527, 1231456, 1364537, 889412],
size_video3 = [1034108, 957685, 877771, 933276, 996749, 801058, 905515, 1060487, 852833, 913888, 939819, 917428, 946851, 1036454, 821631, 923170, 966699, 885714, 987708, 923755, 891604, 955231, 968026, 874175, 897976, 905935, 1076599, 758197, 972798, 975811, 873429, 954453, 885062, 1035329, 1026056, 943942, 728962, 938587, 908665, 930577, 858450, 1025005, 886255, 973972, 958994, 982064, 830730, 846370, 598850],
size_video4 = [668286, 611087, 571051, 617681, 652874, 520315, 561791, 709534, 584846, 560821, 607410, 594078, 624282, 687371, 526950, 587876, 617242, 581493, 639204, 586839, 601738, 616206, 656471, 536667, 587236, 590335, 696376, 487160, 622896, 641447, 570392, 620283, 584349, 670129, 690253, 598727, 487812, 575591, 605884, 587506, 566904, 641452, 599477, 634861, 630203, 638661, 538612, 550906, 391450],
size_video5 = [450283, 398865, 350812, 382355, 411561, 318564, 352642, 437162, 374758, 362795, 353220, 405134, 386351, 434409, 337059, 366214, 360831, 372963, 405596, 350713, 386472, 399894, 401853, 343800, 359903, 379700, 425781, 277716, 400396, 400508, 358218, 400322, 369834, 412837, 401088, 365161, 321064, 361565, 378327, 390680, 345516, 384505, 372093, 438281, 398987, 393804, 331053, 314107, 255954],
size_video6 = [181801, 155580, 139857, 155432, 163442, 126289, 153295, 173849, 150710, 139105, 141840, 156148, 160746, 179801, 140051, 138313, 143509, 150616, 165384, 140881, 157671, 157812, 163927, 137654, 146754, 153938, 181901, 111155, 153605, 149029, 157421, 157488, 143881, 163444, 179328, 159914, 131610, 124011, 144254, 149991, 147968, 161857, 145210, 172312, 167025, 160064, 137507, 118421, 112270];
var vidSize = size_video1.length;
// Rule that selects the lowest possible bitrate
function RLRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let Debug = factory.getSingletonFactoryByName('Debug');
    let context = this.context;
    let instance;

    function setup() {
    }

    // Always use lowest bitrate
    function getMaxIndex(rulesContext) {
        // here you can get some informations about metrics for example, to implement the rule
        let metricsModel = MetricsModel(context).getInstance();
        var mediaType = rulesContext.getMediaInfo().type;
        var metrics = metricsModel.getMetricsFor(mediaType, true);
        let dashMetrics = DashMetrics(context).getInstance();

        // Get current bitrate
        let streamController = StreamController(context).getInstance();
        let abrController = rulesContext.getAbrController();

        let quality = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());
        let buffer = dashMetrics.getCurrentBufferLevel(mediaType);
        let bufferState = dashMetrics.getCurrentBufferState(mediaType);

        // Try and estimate total rebuffering time
        if(bufferState != null && bufferState.state == "bufferStalled" && startRebufferCalc == false){
            console.log("bufferStalled");
            startRebufferTime = Date.now();
            startRebufferCalc = true;
        }
        if(startRebufferCalc == true && bufferState.state != "bufferStalled"){
            console.log("calculating rebuffering");
            endRebufferTime = Date.now();
            currentRebufferTime = (endRebufferTime - startRebufferTime)/1000;
            startRebufferCalc = false;
        }
        if(dashMetrics.getCurrentHttpRequest(mediaType) != null){
            let url = dashMetrics.getCurrentHttpRequest(mediaType).url;
            lastReq = url.match("[0-9]+.m4s");
            lastReq = parseInt(lastReq[0]);
        }
        switch(quality) {
            case 0:
                chunkSize = size_video6[lastReq] / 1000000;
                break;
            case 1:
                chunkSize = size_video5[lastReq] / 1000000;
                break;
            case 2:
                chunkSize = size_video4[lastReq] / 1000000;
                break;
            case 3:
                chunkSize = size_video3[lastReq] / 1000000;
                break;
            case 4:
                chunkSize = size_video2[lastReq] / 1000000;
                break;
            default:
                chunkSize = size_video1[lastReq] / 1000000;
                break;
        }
        let nextChunks = []
        if(lastReq < vidSize){
            nextChunks = [size_video6[lastReq + 1] / 1000000, size_video5[lastReq] / 1000000, size_video4[lastReq] / 1000000, size_video3[lastReq] / 1000000, size_video2[lastReq] / 1000000, size_video1[lastReq] / 1000000]

        }
        leftOverChunks = vidSize - lastReq;
        console.log(lastReq);
        console.log(nextChunks);
        var data = {'currQuality': quality, 'buffer': buffer, 'rebufferTime': currentRebufferTime, 'chunkSize': chunkSize, 'chunksRemaining': leftOverChunks, 'nextChunks': nextChunks };
        var getPy = $.ajax({
            type: "POST",
            url: restAPI + "testABR",   
            async: false,
            data: { mydata: JSON.stringify(data) }
        });
        console.log('QUALITY CHOSEN BY SERVER:' + getPy.responseText);
        let newQual = parseInt(getPy.responseText);
        if (quality === newQual) {
            return SwitchRequest(context).create();
        }

        // Ask to switch to the lowest bitrate
        let switchRequest = SwitchRequest(context).create();
        switchRequest.quality = newQual;
        switchRequest.reason = 'Switch to RL predicted rate';
        switchRequest.priority = SwitchRequest.PRIORITY.STRONG;
        return switchRequest;
    }

    instance = {
        getMaxIndex: getMaxIndex
    };

    setup();

    return instance;
}

RLRuleClass.__dashjs_factory_name = 'RLRule';
RLRule = dashjs.FactoryMaker.getClassFactory(RLRuleClass);