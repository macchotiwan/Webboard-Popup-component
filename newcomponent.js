(function() {

    const discussion_link = `https://webboard.moneyguru.co.th/discussion/${vanilla_discussion_id}`;

    const elm_cta = () => {
        const mainCta = `<a class="webboard-cta" href="${discussion_link}">ถามตอบเกี่ยวกับบทความนี้ ได้ที่นี่</a>`;
        return mainCta;
    }

    let isClose = false;

    // document.querySelector('.share-button-wrapper').innerHTML+=`<a class="webboard-cta" href="">test</a>`;
    document.querySelector('.share-button-wrapper').innerHTML+=`${elm_cta()}`;
    const webboard_cta = document.querySelector('.webboard-cta');
    webboard_cta.style = `padding: 0 8px;
    background-color: #076b9c;
    color: #fff;
    border-radius: 2px;
    font-size: 13px;
    font-weight: 600;`;
    
    
    
    const get_discussion_cat = async () => {
        const staging = 'https://moneyguru.vanillastaging.com/api/v2';
        const prod = 'https://webboard.moneyguru.co.th/api/v2/discussions';
  
        const response = await fetch(`${prod}/${vanilla_discussion_id}`);
        const data = await response.json();
        const cat_id = data.categoryID;
        return cat_id;
    }


    const get_related_discussion = async (cat_id) => {
        const staging = 'https://moneyguru.vanillastaging.com/api/v2';
        const prod = 'https://webboard.moneyguru.co.th/api/v2/discussions'; 
        const response = await fetch(`${prod}?categoryID=${cat_id}&type=discussion&followed=false&pinOrder=first&page=1&limit=1&sort=dateInserted&expand=`);
        const data = await response.json();
        return data[0];
    }

    const get_recommended_discussion = async () => {
        const staging = 'https://moneyguru.vanillastaging.com/api/v2';
        const prod = 'https://webboard.moneyguru.co.th/api/v2/discussions'; 
        const response = await fetch(`${prod}?followed=false&pinOrder=first&page=1&limit=30&sort=dateLastComment&expand=`);
        const data = await response.json();
        let  max = -Infinity,key;   
        data.forEach(function (v, k) { 
            if (max < +v.countComments) { 
                max = +v.countComments; 
                key = k; 
            }
        })
        return data[key];
    }

    const get_author = async (user_id) => {
        const staging = 'https://moneyguru.vanillastaging.com/api/v2';
        const prod = 'https://webboard.moneyguru.co.th/api/v2/users/'; 
        const response = await fetch(`${prod}${user_id}`);
        const data = await response.json();
        return data;
    }



    const elm_popup = async () => {
        const related_discussion = await get_discussion_cat().then(cat_id =>get_related_discussion(cat_id));
        const related_title = related_discussion.name.length > 50 ? `${related_discussion.name.slice(0,50)}...` : related_discussion.name;
        const related_url = related_discussion.url;
        const related_user_id = related_discussion.insertUserID;
        const related_author = await get_author(related_user_id);
        const related_author_name = related_author.name;
        const related_profile_img = related_author.photoUrl;

        const recommended_discussion = await get_recommended_discussion();
        const recommended_title = recommended_discussion.name;
        const recommended_url = recommended_discussion.url;
        const user_id = recommended_discussion.insertUserID;
        const recommended_author = await get_author(user_id);
        const recommended_author_name = recommended_author.name;
        const recommended_profile_img = recommended_author.photoUrl;

        const elm = `
        <div class="webboard-popup">
            <div class="row">
                <div class="col-md-4">
                    <div class="row webboard-popup-titie">
                    เกี่ยวกับบทความ
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="row webboard-popup-titie">
                    กระทู้ที่เกี่ยวข้อง
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="row webboard-popup-titie">
                    กระทู้ที่น่าสนใจ
                    </div>
                </div>
            </div>

            <i class="fa fa-times close-popup"></i>   

            <hr/>

            <div class="row">
                <div class="col-md-4">
                    <div class="title">
                    มีคำถามเกี่ยวกับบทความนี้?
                    </div>
                    <a class="redirect-cta" href="${discussion_link}" rel="nofollow">
                    ถามได้ที่นี่
                    </a>
                </div>

                <div class="col-md-4">
                    <a href="${related_url}" class="row" rel="nofollow">
                        <div class="image col-md-4">
                            <img src="${related_profile_img}" alt="profile-image"/>
                        </div>
                        <div class="col-md-8 info-container">
                            <div class="title">
                            ${related_title}
                            </div>
                            <div class="author-name">
                            By: ${related_author_name}
                            </div>
                        </div>
                    </a>
                </div>

                <div class="col-md-4">                        
                    <a href="${recommended_url}" class="row" rel="nofollow">
                        <div class="image col-md-4">
                            <img src="${recommended_profile_img}" alt="profile-image"/>
                        </div>
                        <div class="col-md-8 info-container">
                            <div class="title">
                            ${recommended_title}
                            </div>
                            <div class="author-name">
                            By: ${recommended_author_name}
                            </div>
                        </div>
                    </a>        
                </div>   
            </div>     
        </div>`
        return elm;
    }
    
    const render_elm_popup = async () => {
        const elm =  await elm_popup();
        document.querySelector('body').innerHTML+=elm;
        //close popup btn
        document.querySelector('.webboard-popup .close-popup').onclick = close_popup;
        //onscroll event
        let lastScrollTop = 0;
        jQuery(window).scroll(function(event){
            const elm = jQuery('.webboard-popup');
            var st = jQuery(this).scrollTop();
            if (st > lastScrollTop){
            isClose? '' : elm.slideUp('fast');
                // downscroll code
            } else {                
              isClose? '' : elm.slideDown('fast');
                // upscroll code
            }
            lastScrollTop = st;
        });
    
    }
    
    render_elm_popup();

    const close_popup = () => {
        isClose = true;
        document.querySelector('.webboard-popup').style.display = 'none';
    }


 })();
  
    
//CSS part
var sheet = document.createElement('style')
sheet.innerHTML = `
    .webboard-popup {
        font-family: Kanit;
        position: fixed;
        bottom: 0;
        margin-left: 25%;
        width: 743px;
        padding: 0 11.5px 6px 11.5px;
        border-radius: 8px;
        box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.08);
        border: solid 1px rgba(0, 0, 0, 0.05);
        z-index: 2;
        background-color: #fff;
    }
    .webboard-popup hr {
        margin-top: 8px;
        margin-bottom: 12px;
    }
    .webboard-popup .row {
        margin-left: 0;
        margin-right: 0;
    }
    .row.webboard-popup-titie {  
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #333;
        margin-top: 8px;
    }
    .webboard-popup .fa.fa-times {
        position: absolute;
        right: 12px;
        top: 12px;
        font-size: 16px;
        color: #9D9D9D;
    }
    .webboard-popup .title {
        font-size: 14px;
        font-weight: 600;
        color: #076b9c;
    }
    .webboard-popup .redirect-cta {
        background-color: #77aa43;
        border-radius: 2px;
        margin-top: 4px;
        padding: 8px 8.5px 8px;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        display: block;
        width: fit-content;
    }
    .webboard-popup .image {
        padding-left: 0px;
        padding-right: 0px;
    }
    .webboard-popup img {
        width: 54px;
        height: 54px;
        border-radius: 3px;
    }
    .webboard-popup .author-name {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 300;
        color: #333;
    }
    .webboard-popup .info-container {
        padding-left: 0px;
    }
    .webboard-popup .close-popup:hover {
        cursor: pointer;
    }
    .swggAnimateSlide {
        overflow-y: hidden;
        transition: all 500ms linear;
    }
    .swggAnimateSlideUp {
        border-bottom: 0 !important;
        border-top: 0 !important;
        margin-bottom: 0 !important;
        margin-top: 0 !important;
        max-height: 0 !important;
        padding-bottom: 0 !important;
        padding-top: 0 !important;
    }
`;

document.body.appendChild(sheet);
