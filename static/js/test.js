var result = eval('(${result})');
        var timeline = eval('(${timeline})');
        console.log(result);
        console.log(timeline);
        // 路径配置
         require.config({
            paths : {
                echarts : '${ctx}/report/common/echarts/build/dist'
            }
        });
        require([ 'echarts', 'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
        ], function(echarts) {
            var myChart = echarts.init(document.getElementById('main'));
            var option = {
                timeline : {
                    data : timeline.data,
                    label : {
                        formatter : function(s) {
                            return s.slice(0, 4);
                        }
                    },
                    autoPlay : true,
                    playInterval : 1000
                },
                options : [ {
                    title : {
                        text : '上海地图',
                        subtext : '-。-'
                    },
                    tooltip : {trigger: 'item',formatter: '{b}:{c}'},
                    legend : {
                        show:false,
                        orient : 'vertical',
                        x : 'right',
                        data : [ '数据名称' ]
                    },
                     dataRange: {
                            min: 0,
                            max : 200,
                            text:['高','低'],           // 文本，默认为数值文本
                            calculable : true,
                            x: 'left',
                            color: ['orangered','yellow','lightskyblue']
                        },
                    roamController : {
                        show : true,
                        x : 'right',
                        mapTypeControl : {
                            'china' : true
                        }
                    },
                    title : {
                        'text' : result.data[0].title.text
                    },
                    series : [ {
                        type : 'map',
                        mapType : 'china',
                        //'selectedMode' : 'single',
                        selectedMode : 'single',
                        itemStyle : {
                            normal : {
                                label : {
                                    show : true
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true
                                }
                            }
                        },
 
                        'data' : result.data[0].series[0].data
                    } ]
                }
                ]
            };
            option.options.push(result.data[1]);
            option.options.push(result.data[2]);
            option.options.push(result.data[3]);
            option.options.push(result.data[4]);
            myChart.setOption(option);
             
        });