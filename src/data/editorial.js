export const personalInstagram='https://www.instagram.com/kripaaa___/';
export const studioFilmSource='https://www.instagram.com/kripaaa___/reel/DdskU-dRKe0/';
const post=(account,id,type='p')=>`https://www.instagram.com/${account}/${type}/${id}/`;
export const projects=[
 {id:'riya',name:'An evening, entirely yours.',person:'Riya Basnet',occasion:'Evening gown',images:['riya-gown'],description:'A strapless dark gown with a sculpted bodice and a flowing skirt. Worn by Riya Basnet.',source:post('riyabasnet','DdOktfajckB')},
 {id:'aditi',name:'A little red. A lasting impression.',person:'Aditi Shrestha',occasion:'Red sequin dress',images:['aditi-red'],description:'A long red sequin dress that catches the light with every movement. Worn by Aditi Shrestha.',source:post('itsaditishrestha_','DcbJ2URiels')},
 {id:'graduation',name:'For the next chapter.',person:'@__neesaa.dhimal__',occasion:'Graduation dress',images:['graduation-dress'],description:'A white graduation dress for a moment worth remembering. Soft detail, a personal silhouette, a new beginning.',source:post('__neesaa.dhimal__','DdBuyYCIloT','reel')},
 {id:'luni',name:'A wardrobe that travels.',person:'Luni',occasion:'Vietnam wardrobe',images:['luni-vietnam','luni-beach'],description:'From a white dress on the water to soft pink by the beach. Two pieces from the wardrobe Kripa created for Luni’s Vietnam journey.',source:post('luniluit','DcGvmvhvhR4','reel'),additionalSources:[post('luniluit','DcDYoCyR8G5','reel')]},
 {id:'roneeshma',name:'Made to move with the music.',person:'Roneeshma',occasion:'Music-video outfit',images:['music-video','roneeshma-look'],description:'A playful pink and yellow floral outfit brought to life by Roneeshma in the Pagal Pagal music-video styling.',source:post('roneeshma','Db0LLQADOYG'),additionalSources:[post('official.kripa','Db3CDNsvkHq','reel')]},
 {id:'forever',name:'A glimpse of forever.',person:'@ma_n_saa',occasion:'A personal celebration',images:['client-forever'],description:'An ivory occasion look shared alongside a personal thank-you to Kripa. A garment becomes part of a memory.',source:post('ma_n_saa','DdlIQnRkQffwg_YRzdQxJr1tegzUscWRElaTHk0')},
];
export const features=[
 {id:'riya',name:'Riya Basnet',image:'riya-gown',context:'An evening gown, worn her way.',credit:'Gown by Designed by Kripa and Veriation.',projectId:'riya',source:projects[0].source},
 {id:'aditi',name:'Aditi Shrestha',image:'aditi-red',context:'Red sequins. Her own spotlight.',credit:'Red sequin dress by Kripa.',projectId:'aditi',source:projects[1].source},
 {id:'luni',name:'Luni',image:'luni-vietnam',context:'From Nepal to Vietnam.',credit:'Vietnam wardrobe by Kripa.',projectId:'luni',source:projects[3].source},
 {id:'roneeshma',name:'Roneeshma',image:'music-video',context:'An outfit with its own rhythm.',credit:'Music-video outfit by Kripa.',projectId:'roneeshma',source:projects[4].source},
 {id:'deepshikha',name:'Deepshikha Nepal',image:'deepshikha-occasion',context:'The studio, out in the world.',credit:'A Veriation and Designed by Kripa look.',productId:'nora-jacket',source:post('deepshikha_nepal','Dbk2ulNDb5m')},
 {id:'graduation',name:'@__neesaa.dhimal__',image:'graduation-dress',context:'A dress for the next chapter.',credit:'Graduation dress by Designed by Kripa.',projectId:'graduation',source:projects[2].source},
];
export const appreciation=[
 {name:'Riya Basnet',quote:'Flaunting this stunning gown',image:'riya-gown',source:projects[0].source,context:'From her credited gown post'},
 {name:'@__neesaa.dhimal__',quote:'obsessed with my graduation dress.',image:'graduation-dress',source:projects[2].source,context:'From her graduation reel'},
 {name:'@ma_n_saa',quote:'thank you @official.kripa for this beautiful gift',image:'client-forever',source:projects[5].source,context:'From a personal celebration'},
];
