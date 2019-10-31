import Ejs, { clearCache } from 'ejs'
class Tpl {
    tplPassiveAnswer = `
    <xml>
        <ToUserName><![CDATA[<%-toUserName-%>]]></ToUserName>
        <FromUserName><![CDATA[<%-fromUserName-%>]]></FromUserName>
        <CreateTime><%-createTime-%></CreateTime>
        <MsgType><![CDATA[<%-msgType-%>]]></MsgType>
        <%if(msgType === 'text'){%> 
            <Content><![CDATA[<%-content-%>]]></Content>
        <%} else if (msgType === 'image'){%>   
            <Image>
                 <MediaId><![CDATA[ <%-  content.media_id  -%> ]]></MediaId>
             </Image>
        <%  } else if (msgType === 'voice' ){  %>  
            <Voice>
                 <MediaId><![CDATA[  <%-  content.media_id  -%> ]]></MediaId>
            </Voice>
         <%  } else if (msgType === 'video' ){  %>  
            <Video>
                <MediaId><![CDATA[  <%-  content.media_id  -%>  ]]></MediaId>
                <Title><![CDATA[  <%- content.title  -%> ]]></Title>
                <Description><![CDATA[  <%-  content.description  -%>  ]]></Description>
            </Video>
        <%  } else if (msgType === 'music' ){  %>     
            <Music>
                <Title><![CDATA[  <%-  content.title  -%> ]]></Title>
                <Description><![CDATA[ <%-  content.DESCRIPTION  -%> ]]></Description>
                <MusicUrl><![CDATA[ <%-  content.MUSIC_Url  -%> ]]></MusicUrl>
                <HQMusicUrl><![CDATA[ <%-  content.HQ_MUSIC_Url  -%> ]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[ <%-  content.media_id  -%> ]]></ThumbMediaId>
             </Music>
         <%  } else if (msgType === 'news' ){   %> 
             <ArticleCount><%- content.length -%></ArticleCount>
             <Articles>
                 <% content.forEach(function(item){ %>
                    <item>
                       <Title><![CDATA[<%- item.title1  -%> ]]></Title>
                       <Description><![CDATA[<%- item.description1  -%>  ]]></Description>
                       <PicUrl><![CDATA[<%- item.picurl  -%>  ]]></PicUrl>
                       <Url><![CDATA[<%- item.url -%> ]]></Url>
                     </item>
                 <% }) %>    
             </Articles>
        <%  }  %>    
    </xml>
    `
    getTpl(data: any) {
        return Ejs.render(this.tplPassiveAnswer, data)
    }
}


export default new Tpl