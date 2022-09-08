async function get_answer(dat) {

  for (let i=0;i<dat.length;i++) {
    dat[i].answers = [
      {
        value: '1',
        text: dat[i].answer_true
      },
      {
        value: '2',
        text: dat[i].answer_false1
      },
      {
        value: '3',
        text: dat[i].answer_false2
      },
      {
        value: '4',
        text: dat[i].answer_false3
      },
      {
        value: '5',
        text: dat[i].answer_false4
      },
    ]
  dat[i].answers = dat[i].answers.sort((elem1, elem2) => Math.random() - 0.5)

  }

}


module.exports= { get_answer}