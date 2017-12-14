import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2'

class App extends Component {

  constructor(props) {
      super(props)

      this.state = {
          data: [],
          labels: [],
          dataResis: {},
          isLoading: true,
          gotData: false,
          isStarted: false,
      }
      this.getRepoInfo = this.getRepoInfo.bind(this)
      this.getData = this.getData.bind(this)
  }

  speakerList = [
      { name: 'toniov', repo_name: 'gcalcron' },
      { name: 'akameco', repo_name: 's2s' },
      { name: 'brn', repo_name: 'mocha' },
      { name: 'sota1235', repo_name: 'eslint-plugin-no-document-cookie' },
      { name: 'edwardkenfox', repo_name: 'scheme-on-the-browser' },
      { name: 'nicholaslee119', repo_name: 'webpack-component-loader' },
      { name: 'joe-re', repo_name: 'async-storage-repl' },
      { name: 'kjirou', repo_name: 'text-sketchbook' },
  ]

  componentDidMount() {
    this.getRepoInfo()
  }

  getRepoInfo() {
      try {

          const labels = []
          const data = []
          const dataResis = {}

          this.speakerList.forEach((speaker, index) => {
              fetch(`https://api.github.com/repos/${speaker.name}/${speaker.repo_name}`).then(r => r.json()).then(
                  repo => {
                      data.push(repo.stargazers_count)
                      labels.push(speaker.name)
                      dataResis[speaker.name] = { index, data: repo.stargazers_count }
                      if (data.length === this.speakerList.length) {
                          this.setState({
                              isLoading: false,
                              data,
                              labels,
                              dataResis,
                              gotData: true,
                          })
                      }
                  }
              )
          })
      } catch (e) {

      }
  }

  getData(data) {
      const { labels } = this.state


      const chartData = {
          labels,
          datasets : [{
              label: 'Nihonbashi.js #3 100star以下限定！細かすぎて伝わらない自作ライブラリ選手権',
              data,
              backgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgb(244, 66, 167)',
                'rgb(49, 198, 196',
                'rgb(239, 81, 23)',
                'rgb(199, 239, 22)',
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgb(244, 66, 167)',
                'rgb(49, 198, 196',
                'rgb(239, 81, 23)',
                'rgb(199, 239, 22)',
              ],
              borderWidth: 1
          }]
      }

      return chartData
  }

  onhandleStart() {
      this.getNewData()
      setInterval(() => this.getNewData(), 60 * 60 * 5)
  }

  getNewData = () => {
          const newData = []
          const dataDiff = []
          const { dataResis } = this.state

          this.speakerList.forEach(speaker => {
              fetch(`https://api.github.com/repos/${speaker.name}/${speaker.repo_name}`).then(r => r.json()).then(
                  repo => {
                      const { index, data } = dataResis[speaker.name]
                      newData[index] = repo.stargazers_count
                      dataDiff[index] = newData[index] - data
                      if (dataDiff.length === this.speakerList.length) {
                          this.setState({
                              data: dataDiff,
                              isStarted: true,
                          })
                      }
                  }
              )
          })
  }

  render() {
      if (this.state.isLoading) {
          return (
              <div />
          )
      }

      return (
        <div className="App">
            { !this.state.isStarted ?
              <button onClick={() => this.onhandleStart()}>スタート</button>
              : false
            }
            <Bar
                data={() => this.getData(this.state.data)}
            />
        </div>
      )
  }
}

export default App;
