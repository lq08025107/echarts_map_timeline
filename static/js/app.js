//地图容器
var chart = echarts.init(document.getElementById('main'));
//34个省、市、自治区的名字拼音映射数组
var provinces = {
    //23个省
    "台湾": "taiwan",
    "河北": "hebei",
    "山西": "shanxi",
    "辽宁": "liaoning",
    "吉林": "jilin",
    "黑龙江": "heilongjiang",
    "江苏": "jiangsu",
    "浙江": "zhejiang",
    "安徽": "anhui",
    "福建": "fujian",
    "江西": "jiangxi",
    "山东": "shandong",
    "河南": "henan",
    "湖北": "hubei",
    "湖南": "hunan",
    "广东": "guangdong",
    "海南": "hainan",
    "四川": "sichuan",
    "贵州": "guizhou",
    "云南": "yunnan",
    "陕西": "shanxi1",
    "甘肃": "gansu",
    "青海": "qinghai",
    //5个自治区
    "新疆": "xinjiang",
    "广西": "guangxi",
    "内蒙古": "neimenggu",
    "宁夏": "ningxia",
    "西藏": "xizang",
    //4个直辖市
    "北京": "beijing",
    "天津": "tianjin",
    "上海": "shanghai",
    "重庆": "chongqing",
    //2个特别行政区
    "香港": "xianggang",
    "澳门": "aomen"
};

var mydata;
var citydata;

//获取省级模拟数据
function getValue(){
    
    $.ajax({
      url: 'http://localhost:8080/provinces',
      async: false,
      dataType: 'json',
      success: function (data) {
      mydata = data;
      },
      error: function(){
        //mydata = "error";
        console.log('error');
      }
    });
    
    return mydata;
}
//获取全国各省数据
getValue();

function getLevels(){
    var result;
    $.ajax({
        url: 'http://localhost:8080/levels',
        async: false,
        dataType: 'json',
        success: function(data){
            result = data;
        },
        error: function(){
            console.log('error');
        }
    });
    return result;
}

function getCompletion(){
    var result;
    $.ajax({
        url: 'http://localhost:8080/completion',
        async: false,
        dataType: 'json',
        success: function(data){
            result = data;
        },
        error: function(){
            console.log('error');
        }
    });
    return result;
}
//直辖市和特别行政区-只有二级地图，没有三级地图
var special = ["北京","天津","上海","重庆","香港","澳门"];
var mapdata = [];

//绘制全国地图
$.getJSON('static/map/china.json', function(data){
	d = [];
	for( var i=0;i<data.features.length;i++ ){
		d.push({
			name:data.features[i].properties.name, value:mydata[data.features[i].properties.name]
		})
	}
	mapdata = d;
	//注册地图
	echarts.registerMap('china', data);
	//绘制地图
	renderMap('china',d);
});

//地图点击事件
chart.on('click', function (params) {
    if(params.componentType == 'timeline'){
        console.log('timeline click');
    }
    else {
        console.log( params );
        if( params.name in provinces ){
            //获取城市测试数据
            $.ajax({
                url: 'http://localhost:8080/citys?name='+params.name,
                async: false,
                dataType: 'json',
                success: function(data){
                    console.log(data)
                    citydata = data;
                },
                error: function(error){
                    console.log(error)
                }
            });
            //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
            $.getJSON('static/map/province/'+ provinces[params.name] +'.json', function(data){
                echarts.registerMap( params.name, data);
                var d = [];
                for( var i=0;i<data.features.length;i++ ){
                    d.push({
                        name:data.features[i].properties.name, value:citydata[data.features[i].properties.name]
                    })
                }
                renderMap(params.name,d);
            });
        }else if( params.seriesName in provinces ){
            //如果是【直辖市/特别行政区】只有二级下钻
            if(  special.indexOf( params.seriesName ) >=0  ){
                renderMap('china',mapdata);
            }else{
                //显示县级地图
                $.getJSON('static/map/city/'+ cityMap[params.name] +'.json', function(data){
                    echarts.registerMap( params.name, data);
                    var d = [];
                    for( var i=0;i<data.features.length;i++ ){
                        d.push({
                            name:data.features[i].properties.name
                        })
                    }
                    renderMap(params.name,d);
                }); 
            }   
        }else{
            renderMap('china',mapdata);
        }
    }
    }
	);


var timeByMonth = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];//timeline初始值
var baseOption = {
    backgroundColor: '#000',
    //backgroundColor: 'rgba(0,0,0,0)',
    title : [{
        text: '全国警情数据统计',
        subtext: '',
        link:'',
        left: 'center',
        textStyle:{
            color: '#fff',
            fontSize:16,
            fontWeight:'normal',
            fontFamily:"Microsoft YaHei"
        },
        subtextStyle:{
            color: '#ccc',
            fontSize:13,
            fontWeight:'normal',
            fontFamily:"Microsoft YaHei"
        }
    },
    {
        text: '设备巡检情况',
        left: '8%',
        top: '25%',
        textStyle:{
        color: '#fff',
        fontSize:16,
        fontWeight:'normal',
        fontFamily:"Microsoft YaHei"
    }
    },
    {
        text: '综合警情统计',
        left: '85%',
        top: '25%',
        textStyle:{
        color: '#fff',
        fontSize:16,
        fontWeight:'normal',
        fontFamily:"Microsoft YaHei"
    }
    }],

    timeline: {
        show: true,
        axisType: 'category',
        autoPlay: false,
        currentIndex: 5,
        playInterval: 5000,
        symbolSize: 12,
        //realtime: true,
        checkpointStyle: {
            symbol: 'circle',
            symbolSize: 18,
            color: '#00d3e7',
            borderWidth: 2,
            borderColor: "#00d3e7"
        },
        label: {
            normal: {
                show: true,
                textStyle: {
                    fontSize: '14',
                    color:'#fff'
                }
            },
            emphasis:{
                textStyle: {
                    fontSize: '18',
                    color:'#00d3e7'
                }
            }
        },
        data: timeByMonth
    },
    visualMap: {
        min: 1,
        max: 1000,
        left: '10%',
        top: '68%',
        text: ['高','低'],
        calculable: true,
        itemWidth: 20,
        inRange: {
            color: ['#e0ffff', '#FF0000']
        },
        textStyle: {
            fontSize: '16',
            color:'#fff'
        },
        seriesIndex: 0
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}'
    }
};

var options = [];
var mapOption = {};
// for(var i=0;i<timeByMonth.length;i++){
//     options.push({
//         series: baseOption.series//此处可以根据实际情况循环放置每个option的series对应的data值
//     });
// }
mapOption.baseOption = baseOption;
mapOption.options = options;


    
function renderMap(map,data){
    var levels = getLevels();
    baseOption.series = [ 
		{
            name: map,
            type: 'map',
            mapType: map,
            roam: false,
            nameMap:{
			    'china':'中国'
			},
            label: {
	            normal:{
					show:true,
					textStyle:{
						color:'#999',
						fontSize:13
					}  
	            },
	            emphasis: {
	                show: true,
	                textStyle:{
						color:'#fff',
						fontSize:13
					}
	            }
	        },
	        itemStyle: {
	            normal: {
	                areaColor: '#323c48',
	                borderColor: 'dodgerblue'
	            },
	            emphasis: {
	                areaColor: 'darkorange'
	            }
	        },
            data:data
        },

        //饼状图
        {
            name:'警情综合统计',
            type:'pie',
            radius : '20%',
            center: [document.getElementById('main').offsetWidth - 165, 325],
            //color : ['rgb(252,157,154)','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)'],
            data:[
                {value:levels['highest'], name:'最高级警情'},
                {value:levels['high'], name:'高级警情'},
                {value:levels['middle'], name:'中级警情'},
                {value:levels['low'], name:'低级警情'}
            ],
            visualMap: false
        },
//        仪表盘
        {
            name:'完成率',
            center:['12%', '45%'],
            radius: '30%',
            type:'gauge',
            startAngle: 140,
            endAngle : -140,
            min: 0,                     // 最小值
            max: 100,                   // 最大值
            precision: 0,               // 小数精度，默认为0，无小数点
            splitNumber: 10,             // 分割段数，默认为5
            axisLine: {            // 坐标轴线
                show: true,        // 默认显示，属性show控制显示与否
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, 'lightgreen'],[0.4, 'orange'],[0.8, 'skyblue'],[1, '#ff4500']], 
                    width: 30
                }
            },
            axisTick: {            // 坐标轴小标记
                show: true,        // 属性show控制显示与否，默认不显示
                splitNumber: 5,    // 每份split细分多少段
                length :8,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#eee',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                show: true,
                formatter: function(v){
                    switch (v+''){
                        case '10': return '弱';
                        case '30': return '低';
                        case '60': return '中';
                        case '90': return '高';
                        default: return '';
                    }
                },
                // textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                //     color: ''
                // }
            },
            splitLine: {           // 分隔线
                show: true,        // 默认显示，属性show控制显示与否
                length :30,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: '#eee',
                    width: 2,
                    type: 'solid'
                }
            },
            pointer : {
                length : '80%',
                width : 8,
                color : 'auto'
            },
            title : {
                show : true,
                offsetCenter: ['-65%', -30],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'red',
                    fontSize : 30
                }
            },
            detail : {
                show : true,
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
                borderColor: '#ccc',
                width: 100,
                height: 40,
                offsetCenter: ['-60%',0],       // x, y，单位px
                formatter:'{value}%',
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontSize : 30
                }
            },
            data:[{value: getCompletion(), name: '完成率'}]
        }
    ]

    baseOption.color = ['red', 'green','yellow','blueviolet'];
    var d = new Array();
    for (var i = 0; i < data.length - 1; i++) {
        d[i] = 0;
        if(data[i].value != undefined){
            d[i] = data[i].value;    
        }
    }

    baseOption.visualMap.min = Math.min.apply(null, d);
    baseOption.visualMap.max = Math.max.apply(null, d);
    //渲染地图
    chart.setOption(mapOption);
}

    //动态监听时间轴点击事件
function getTimeLinePointOptionData(pointIndex, area) { 
    console.log(pointIndex)
    if(area == "china"){
        getValue();
        $.getJSON('static/map/china.json', function(data){

            d = [];
            for( var i=0;i<data.features.length;i++ ){
                d.push({
                    name:data.features[i].properties.name, value:mydata[data.features[i].properties.name]
                })
            }
            mapdata = d;
            //注册地图
            echarts.registerMap('china', data);
            //绘制地图
            renderMap(area,d);
        });
    }
    else {
        $.ajax({
            url: 'http://localhost:8080/citys?name='+area,
            async: false,
            dataType: 'json',
            success: function(data){
                citydata = data;
            },
            error: function(error){
                console.log(error)
            }
        });

        $.getJSON('static/map/province/'+ provinces[area] +'.json', function(data){
            echarts.registerMap(area, data);
            var d = [];
            for( var i=0;i<data.features.length;i++ ){
                d.push({
                    name:data.features[i].properties.name, value:citydata[data.features[i].properties.name]
                })
            }
            renderMap(area,d);
        });

    }
    
}  
chart.on('timelinechanged', function (timeLineIndex) {  
    // 设置 每个series里的xAxis里的值  
    var arrIndex = parseInt(timeLineIndex.currentIndex);  
  
    //$.post("statistics/map/result", {timelineIndex: arrIndex}, function (jsonData) {  
    //getTimeLinePointOptionData(arrIndex);  
    // 动态修改x轴的值  
    //option.options[arrIndex].xAxis.data = xAxisdata[arrIndex];  
    baseOption.timeline.currentIndex = arrIndex;
    //chart.setOption(mapOption);

    console.log(mapOption.baseOption.series[0].name);
    getTimeLinePointOptionData(arrIndex, mapOption.baseOption.series[0].name)
    //}, "json");  
}); 