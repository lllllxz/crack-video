<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link href="./bootstrap-4.3.1-dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
        <script src="./js/action.js"></script>

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                height: 100vh;
                margin: 0;
            }


            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }


            .content {
                text-align: center;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div>

            <div class="flex-center position-ref">

                <div class="m-b-md" style="font-size: 50px;margin-top: 80px">
                    CRACK VIDEO
                </div>

            </div>
            <div class="content">
                <input type="text" name="url" value="" id="url" style="border-radius: 25px; width:90%; height: 50px;">
                <br>
                <input id="submit" value="转换" type="button" style="width:80px;height:30px;border-radius: 10px; margin-top: 15px; background-color: sandybrown;">
            </div>

            <div id="video_url" style="flex-direction: column; margin-top: 20px;">

            </div>
        </div>
    <script>
        $(function () {
            $("#url").on('input propertychange', function () {
                var vip_url = $("#url").val()
                if (vip_url.length==0){
                    $("#video_url").html('');
                }
            })

        })

        $("#submit").on('click',function () {
            var val = $("#url").val();
            var tar_url = BASE64.encode("https://wn.run/"+val);
            $.ajax({
                url: "https://st.tools8.top/fu/detail_load.php?url="+tar_url,
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'callback1',
                success: function (res) {
                    var go_url = res.list;
                    var link = '';
                    var head = '';
                    $(go_url).each(function (k,v) {
                        if (v.isType && v.typeName=='VIP视频测试播放'){
                            head = "<div class='flex-center'>播放地址</div>";
                        }
                        
                        if (v.toolType == 7){

                            link += "<li style='list-style: none;margin-bottom: 5px'><a class='btn btn-success' href='"+v.targetUrl+"' target='_blank' style='font-size: 20px;text-decoration: none'>"+v.title+"</a></li>"
                        }

                    })

                    var div="<div style='width: 100%;display: flex;flex-direction: column'>"+head+"<div><ul>"+link+"</ul></div></div>"

                    $("#video_url").html(div);
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })


    </script>
    </body>
</html>
