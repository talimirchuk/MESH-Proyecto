const ctx = document.getElementById('graficoCanvas')
const names = ['Tali','Vicky','Martu','Juan','Sofi']
const ages = [14, 15, 16, 17, 18]

const graficoCanvas = new Chart(ctx,{
type: 'line',
data: {
    labels: names,
    datasets:[{
        label:'Edad',
        data: ages,
        backgroundColor:[
            'rgba(255, 0, 0, 0.2)',
            'rgba(0, 149, 255, 0.2)',
            'rgba(99, 255, 99, 0.2)',
            'rgba(0, 238, 255, 0.2)',
            'rgba(140, 0, 255, 0.2)',
            'rgba(255, 187, 0, 0.2)'
        ],
        borderColor: [
            'rgb(255, 0, 0)',
            'rgb(0, 149, 255)',
            'rgb(99, 255, 99)',
            'rgb(0, 238, 255)',
            'rgb(140, 0, 255)',
            'rgb(255, 187, 0)'
        ],
        borderWidth: 1.5
    }]
}
})