export interface ExampleStateInterface {
  name: string;
  project_index_image: { png: '', bounds: {ymin,xmin,ymax,xmax} };
  selected_period_utc:{
    firstDate:number,
    secondDate:number,
    thirdDate:number,
    avg:number
  },
  project_description: any
}

function state(): ExampleStateInterface {
  return <ExampleStateInterface>{
    name: '',
    project_index_image: { png:'',bounds:{ymin:'',xmin:'',ymax:'',xmax:''}},
    selected_period_utc:{
      firstDate:0,
      secondDate:0,
      thirdDate:0,
      avg:0
    },
    project_description: {}
  };
}

export default state;
