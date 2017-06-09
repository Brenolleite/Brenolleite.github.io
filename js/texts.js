var app = angular.module('myHomePage', ['ngCookies']);

var pt = {
    lang: ['Inglês', 'Português'],
    navbar: ['Sobre Mim', 'Interesses', 'Contato'],    
    lifeEvents: ['Ciência da Computação - UTFPR', 'Ciência da Computação - Mississippi State University', 'Desenvolvedor Web - Virtual Softwares', 'Mestado em Ciência da Computação - Unicamp'],
    interestsTitle: 'Interesses',
    interestsPhrase: 'Sou um cientista da computação com anseios em resolver problemas em diversas áreas',
    interestsTitles: ['Aprendizado de máquina', 'Desenvolvimento de Software'],
    interestsTexts: [
        'A idéia de que um computador pode aprender como os humanos é fascinante. Eu atualmente estou envolvido em projeto de pesquisa que utiliza deep learning para automaticamente detectar violência em vídeos. É uma área cheia de desafios, e que esta ganhando muita atenção ultimamente, principalmente pelo grande número de dados disponíveis na internet como vídeos. O foco da pesquisa é detectar violência em câmeras de segurança, ou bloquear automaticamente conteúdos sensitivos em vídeos online.',
        'Softwares são feitos para ajudar pessoas, essa é a principal razão da minha paixão por eles. Nos últimos anos eu me envolvi em diversos projetos de software, desde desenvolvimento de jogos até web sites. Eu sou interessado no desenvolvimento de todos os tipos de softwares, independentemente de plataforma e linguagem utilizadas. Eu adoro trabalhar com projetos que desafiam os conceitos atuais de programação, e aqueles que inovam a forma com que as pessoas interagem com os computadores.'
    ],
    contact: ['Me Contate', 'Deixe uma mensagem', 'Assunto', 'Mensagem', 'Enviar']
}

var en = {
    lang: ['English', 'Portuguese'],
    navbar: ['About me', 'Interests', 'Contact'],    
    lifeEvents: ['Computer Science - UTFPR', 'Computer Science - Mississippi State University', 'Web Developer - Virtual Softwares', 'M.Sc. in Computer Science - Unicamp'],
    interestsTitle: 'Interests',
    interestsPhrase: 'I am a computer scientist, who loves to solve problems on diverse areas',
    interestsTitles: ['Machine Learning', 'Software Development'],
    interestsTexts: [
        'The idea that computers can learn as humans is amazing! I am currently involved on a research project that uses deep learning to automatic recognize violence on videos. It is a field full of challenges, which is getting even more attention lately because of the overwhelming amount of data as videos on the internet. The focus of the research is either to detect violence on surveillance cameras or automatic block sensitive content in online videos.',
        'Softwares are design to help humans, that is the reason why I love them. For the last couple of years I got involved into a lot of development projects, from games to web pages. I am interested in every type of software development, independent of platform and languages. I love to work on projects which challenges the usual concepts, and innovates the way that people interact with the computer.'
    ],
    contact: ['Contact Me', 'Leave a message', 'Subject', 'Message', 'Send']
}

function language(lang, scope){    
    if(lang === 'pt_BR'){
        scope.text = pt;
        scope.currentLang = 'pt_BR';
        $("#en_US").insertAfter("#pt_BR");
    }
    else{
        scope.text = en;
        scope.currentLang = 'en_US';
        $("#pt_BR").insertAfter("#en_US");
    }
}

app.controller('textCtr', ['$scope', '$cookies', function($scope, $cookies) {
    $scope.changeLang = function(lang){        
        language(lang, $scope);
        $cookies.put('lang', lang);
    };

    angular.element(document).ready(function () {
        var lang = $cookies.get('lang');        

        if(!lang)
            lang = window.navigator.userLanguage || window.navigator.language;

        if(lang.indexOf('pt') > -1)        
            language('pt_BR', $scope); 
        else
            language('en_US', $scope);

        $scope.$digest();
    });          
}]);