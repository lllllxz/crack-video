var BASE64 = {

    enKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

    deKey: new Array(
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ),

    encode: function (src) {
        //用一个数组来存放编码后的字符，效率比用字符串相加高很多。
        var str = new Array();
        var ch1, ch2, ch3;
        var pos = 0;
        //每三个字符进行编码。
        while (pos + 3 <= src.length) {
            ch1 = src.charCodeAt(pos++);
            ch2 = src.charCodeAt(pos++);
            ch3 = src.charCodeAt(pos++);
            str.push(this.enKey.charAt(ch1 >> 2), this.enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
            str.push(this.enKey.charAt(((ch2 << 2) + (ch3 >> 6)) & 0x3f), this.enKey.charAt(ch3 & 0x3f));
        }
        //给剩下的字符进行编码。
        if (pos < src.length) {
            ch1 = src.charCodeAt(pos++);
            str.push(this.enKey.charAt(ch1 >> 2));
            if (pos < src.length) {
                ch2 = src.charCodeAt(pos);
                str.push(this.enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
                str.push(this.enKey.charAt(ch2 << 2 & 0x3f), '=');
            } else {
                str.push(this.enKey.charAt(ch1 << 4 & 0x3f), '==');
            }
        }
        //组合各编码后的字符，连成一个字符串。
        return str.join('');
    },

    decode: function (src) {
        //用一个数组来存放解码后的字符。
        var str = new Array();
        var ch1, ch2, ch3, ch4;
        var pos = 0;
        //过滤非法字符，并去掉'='。
        src = src.replace(/[^A-Za-z0-9\+\/]/g, '');
        //decode the source string in partition of per four characters.
        while (pos + 4 <= src.length) {
            ch1 = this.deKey[src.charCodeAt(pos++)];
            ch2 = this.deKey[src.charCodeAt(pos++)];
            ch3 = this.deKey[src.charCodeAt(pos++)];
            ch4 = this.deKey[src.charCodeAt(pos++)];
            str.push(String.fromCharCode(
                (ch1 << 2 & 0xff) + (ch2 >> 4), (ch2 << 4 & 0xff) + (ch3 >> 2), (ch3 << 6 & 0xff) + ch4
            ));
        }
        //给剩下的字符进行解码。
        if (pos + 1 < src.length) {
            ch1 = this.deKey[src.charCodeAt(pos++)];
            ch2 = this.deKey[src.charCodeAt(pos++)];
            if (pos < src.length) {
                ch3 = this.deKey[src.charCodeAt(pos)];
                str.push(String.fromCharCode((ch1 << 2 & 0xff) + (ch2 >> 4), (ch2 << 4 & 0xff) + (ch3 >> 2)));
            } else {
                str.push(String.fromCharCode((ch1 << 2 & 0xff) + (ch2 >> 4)));
            }
        }
        //组合各解码后的字符，连成一个字符串。
        return str.join('');
    }
};



function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}



function loadToolList(preUrl, isbySite) {


    var url = preUrl + "/pub/tool_use.do?dtype=indexOfSites";

    if (isbySite) {
        var domain = GetQueryString("site");
        url = preUrl + "/pub/tool_use.do?dtype=bySite&domain=" + domain;

    }

    $.ajax({
        url: url,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback1",

        success: function (data) {

            if (data) {
                var itemList = $("#itemListId");
                itemList.empty();
                var out = "";
                //var currentEnUrl=data.currentEnUrl;
                //var domainMiddle=data.domainMiddle;
                var enCode = "";
                var list = data.list;
                for (var i = 0; i < list.length; i++) {
                    var index = i + 1;
                    var info = list[i];
                    var line = ' <div class="wnItem"><h2 class="itemTitle" ><span></span>' +
                        '<span  class="jiazai" >' +
                        '<a  class="itemTitleLink" rel="nofollow" target=_blank  href="#"></a>' +
                        '</span> <span class="warningTitle"></span></h2>' +
                        '<div class="itemDesc"></div>' +
                        '     <div class="setDesc overEll">' +
                        '     应用到 <span class="matchDomain" ></span>' +
                        '    </div>' +
                        '     <div class="setDesc">' +
                        '       <a target="_blank" href="/fu/comment.php?type=1&enCode=' + enCode +
                        '&toolId=' + info.id + '" >举报该工具</a>' +

                        '    </div>' +


                        '   </div>';
                    var ob = $(line);
                    ob.find(".itemDesc").text(info.desc);
                    ob.find(".itemTitleLink").text(info.title);
                    ob.find(".matchDomain").text(info.matchDomain).attr("title", info.matchDomain);


                    ob.find(".itemTitleLink").attr("href", info.targetHost);
                    //  ob.find(".warningTitle").text("不带当前链接");


                    //  $("#commentDemandId").attr("href","/fu/comment.php?type=3&enCode="+enCode);


                    itemList.append(ob);

                }
                //$("#listLines").empty("").html(out);

                //$("#domainMiddle").text(domainMiddle);

                //   link=BASE64.decode(currentEnUrl);
                // $("#copy_key_android").val(link);


            } else {

                itemList.append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>');
            }


        },
        error: function (e) {
            var itemList = $("#itemListId");
            itemList.empty().append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>');
        }
    });

}


function loadTags(preUrl) {

    var subUrl = preUrl + "/pub/tool_use.do?dtype=tags";

    $.ajax({
        url: subUrl,
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback1",
        success: function (data) {

            if (data && data.tags) {

                var list = data.tags;
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var val = item.val;
                    if (val == "qq.com") {
                        //	continue;
                    }
                    var size = item.size;
                    size = 10 + size * 3;
                    var line = '<a target="_blank" href="/fu/tool_list.php?site=' + val +
                        '" style="font-size:' + size + 'px" >' + val + '</a>';
                    $("#tags").append(line);
                }

            } else {

                alert("数据加载失败");
            }


        }
    });


}






function loadList(preUrl, isK) {
    var url = window.location.href;
    if (isK) {
        url = GetQueryString("k");
    }
    var addParam = "";
    var topList = getLocalValue("top_list");
    if (topList) {
        addParam += "&top=" + topList;
    }

    //  var postData={"url":url};
    url = BASE64.encode(url);
    $.ajax({
        url: preUrl + "/fu/detail_load.php?url=" + url + addParam,
        //   type: "POST",
        //   dataType: "json",  //指定服务器返回的数据类型
        //  data:postData,

        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback1",
        success: function (data) {

            if (data) {
                var itemList = $("#itemListId");
                itemList.empty();
                var out = "";
                var currentEnUrl = data.currentEnUrl;
                var domainMiddle = data.domainMiddle;
                var enCode = data.enCode;
                var list = data.list;
                for (var i = 0; i < list.length; i++) {
                    var index = i + 1;
                    var info = list[i];
                    if (info.isType) {
                        var typeline = '<div class="typeNameSp">' + info.typeName + ':</div>';
                        itemList.append(typeline);
                        continue;
                    }

                    var topbtnStr = ' <a href="javascript:void(0)" onclick="addTopTool(\'' + info.id +
                        '\')" class="cardItem btn btn-secondary">置顶</a>   ';
                    if (info.toolType == -2) {
                        topbtnStr = ' <a href="javascript:void(0)" onclick="delTopTool(\'' + info.id +
                            '\')" class="cardItem btn btn-secondary">取消置顶</a>   ';
                    }




                    var line =
                        '<div class="tool-li col-lg-4 col-md-6 floatleft"><div class="tool-card-item">' +
                        '<div class="card h-100"><div class="card-block">' +
                        '   <h4 class="card-title"> <a href="" rel="nofollow" target=_blank  class="itemTitleLink" ></a><span class="warningTitle"></span></h4>' +
                        '   <p class="card-text itemDesc"></p>' +
                        '  </div>' +
                        '  <div class="setDesc overEll descUrl" style="">应用到 <span class="matchDomain" title=""></span></div>' +
                        '  <div class="setDesc overEll descUrl descFromUrl" style="">' +
                        '     <span class="matchDomain goUrlSpan" title=""></span>' +
                        '     </div>' +
                        '         <div class="card-footer">' +
                        '           <a href="/fu/comment.php?type=1&enCode=' + enCode + '&toolId=' + info.id +
                        '" target=_blank class="cardItem btn btn-secondary">举报</a> <a target=_blank href="/fu/comment.php?type=2&enCode=' +
                        enCode + '&toolId=' + info.id + '" class="cardItem btn btn-secondary">失效</a>' +
                        topbtnStr +
                        '        </div>' +
                        '    </div>' +
                        '</div></div>';


                    var ob = $(line);
                    ob.find(".itemDesc").text(info.desc).attr("title", info.desc);
                    ob.find(".itemTitleLink").text(info.title);
                    ob.find(".matchDomain").text(info.matchDomain).attr("title", info.matchDomain);

                    if (info.targetUrl) {
                        ob.find(".itemTitleLink").attr("href", info.targetUrl);
                        ob.find(".goUrlSpan").text(info.targetUrl)
                    } else {
                        ob.find(".itemTitleLink").attr("href", info.targetHost);
                        ob.find(".goUrlSpan").text(info.targetHost)
                        ob.find(".warningTitle").text("不带当前链接");
                    }

                    $("#commentDemandId").attr("href", "/fu/comment.php?type=3&enCode=" + enCode);


                    itemList.append(ob);

                }
                //$("#listLines").empty("").html(out);

                $("#domainMiddle").text(domainMiddle);

                link = BASE64.decode(currentEnUrl);
                $("#copy_key_android").val(link);


            } else {

                itemList.append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>');
            }


        },
        error: function (e) {
            var itemList = $("#itemListId");
            //$("body").empty("").append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>').css("background","#fff");
            itemList.empty().append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>');
        }
    });

}






function loadList1(preUrl, isK) {
    var url = window.location.href;
    if (isK) {
        url = GetQueryString("k");
    }

    //  var postData={"url":url};
    url = BASE64.encode(url);
    $.ajax({
        url: preUrl + "/fu/detail_load.php?url=" + url,
        //   type: "POST",
        //   dataType: "json",  //指定服务器返回的数据类型
        //  data:postData,

        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback1",
        success: function (data) {

            if (data) {
                var itemList = $("#itemListId");
                itemList.empty();
                var out = "";
                var currentEnUrl = data.currentEnUrl;
                var domainMiddle = data.domainMiddle;
                var enCode = data.enCode;
                var list = data.list;
                for (var i = 0; i < list.length; i++) {
                    var index = i + 1;
                    var info = list[i];
                    var line = ' <div class="wnItem"><h2 class="itemTitle" ><span>' + index + '、</span>' +
                        '<span  class="jiazai" >' +
                        '<a  class="itemTitleLink" rel="nofollow" target=_blank  href="#"></a>' +
                        '</span> <span class="warningTitle"></span></h2>' +
                        '<div class="itemDesc"></div>' +
                        '     <div class="setDesc overEll">' +
                        '     应用到 <span class="matchDomain" ></span>' +
                        '    </div>' +
                        '     <div class="setDesc">' +
                        '       <a target="_blank" href="/fu/comment.php?type=1&enCode=' + enCode +
                        '&toolId=' + info.id + '" >举报该工具</a>' +
                        '        <a target="_blank" href="/fu/comment.php?type=2&enCode=' + enCode +
                        '&toolId=' + info.id + '" >该工具失效提交</a>' +
                        '    </div>' +


                        '   </div>';
                    var ob = $(line);
                    ob.find(".itemDesc").text(info.desc);
                    ob.find(".itemTitleLink").text(info.title);
                    ob.find(".matchDomain").text(info.matchDomain).attr("title", info.matchDomain);

                    if (info.targetUrl) {
                        ob.find(".itemTitleLink").attr("href", info.targetUrl);
                    } else {
                        ob.find(".itemTitleLink").attr("href", info.targetHost);
                        ob.find(".warningTitle").text("不带当前链接");
                    }

                    $("#commentDemandId").attr("href", "/fu/comment.php?type=3&enCode=" + enCode);


                    itemList.append(ob);

                }
                //$("#listLines").empty("").html(out);

                $("#domainMiddle").text(domainMiddle);

                link = BASE64.decode(currentEnUrl);
                $("#copy_key_android").val(link);


            } else {
                //		$("body").empty("").append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>').css("background","#fff");
                itemList.append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>');
            }


        },
        error: function (e) {
            var itemList = $("#itemListId");
            //	$("body").empty("").append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>').css("background","#fff");
            itemList.empty().append('<h2 style="color:red;margin-left: 10px;">发生错误，请输入正确的网址！</h2>');
        }
    });

}

function selectCopyCode() {
    var e = document.getElementById("copy_key_android");
    e.select();
    e.focus();
    var t = document.createRange();
    t.selectNodeContents(e);
    var n = window.getSelection();
    n.removeAllRanges(),
        n.addRange(t),
        e.setSelectionRange(0, 999999)
}






function addTopTool(toolId) {
    if (confirm("确定要将此工具置顶吗？置顶只对当前浏览器有效。")) {
        var topList = getLocalValue("top_list");
        if (topList) {
            if (topList.indexOf(toolId) == -1) {
                topList += "," + toolId;
                putLocalValue("top_list", topList);
            }
        } else {
            putLocalValue("top_list", toolId);
        }
        alert("置顶成功，即将刷新页面！");
        window.location.reload();
    }

}

function delTopTool(toolId) {
    if (confirm("确定取消对此工具的置顶？")) {
        var topList = getLocalValue("top_list");
        if (topList) {
            if (topList.indexOf(toolId) > -1) {
                var newList = "";
                var arr = topList.split(",");
                for (var i = 0; i < arr.length; i++) {
                    var qId = arr[i];
                    if (qId && toolId != qId) {
                        newList += qId + ",";
                    }
                }

                putLocalValue("top_list", newList);
            }
            alert("取消置顶成功，即将刷新页面！");
            window.location.reload();
        }

    }



}


function getLocalValue(name) {
    var uid = "";
    if (!window.localStorage) {
        // alert("浏览器支持localstorage");
        console.log("浏览器不支持localstorage");

        var val = getCookie(name);
        return val;

    } else {

        var storage = window.localStorage;
        var val = storage[name];
        return val;


    }
    return uid;

}



function putLocalValue(name, value) {
    if (!window.localStorage) {
        console.log("浏览器不支持localstorage");
        setCookie("name", value)
    } else {
        //  console.log("put "+name+" "+value);
        //主逻辑业务
        var storage = window.localStorage;
        try {
            storage[name] = value;
        } catch (_) {
            console.log("使用了隐身模式浏览");
        }


    }

}

function getCookie(c_name) {

    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1)
                c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function setCookie(name, value, date) {
    if (!date) {
        date = 360;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + date * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) +
        ";expires=" + exp.toGMTString() + ";path=/";

    return true;
};