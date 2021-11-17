# Notes about RXJS and NGXS lib below 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.15.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


##################### RXJS #######################
1. OBSERVABLE - obiekt produkujacy dane
2. SUBSKRYPCJA to nasłuchiwanie na zdarzenie
3. obserwator i subskrypcja to minimin, ktore potrzebujemy do uzycia rxjs

4.1. najpopularniejsze metody biblioteki 'rxjs':
a) from() - zamienia tablice na obserwowalny strumien danych

const arr = [1,2,3,4,2,1,7,3,6,...];
const observable = from(arr);

(Zeby wypisac/wyswietlic/popracowac na wartosciach wyprodukowanych przez zrodlo danych musimy je zasubskrybowac). Kazdy element tablicy zostaje osobno wyslany do subskrybenta.

const arr = [1,2,3,4,2,1,7,3,6,...];
const observable = from(arr);
observable.subscribe(val => console.log(val));

b) pipe() pozwola skladac dowolnie wiele funkcji, przyklad uzyty w podpunkcie

c) filter() - filtruje kolejne elementy strumienia zwracajac tylko te spelniajace konkretny warunek, np. liczby parzyste

const arr = [1,2,3,4,2,1,7,3,6,6,10,1,14];
const observable = from(arr).pipe(
	.filter(val => val % 2 === 0),
)
observable.subscribe(val => console.log(val));

d) distinct() - odsiewa nam powielajace sie elementy

const arr = [1,2,3,4,2,1,7,3,6,...];
const observable = from(arr).pipe(
	.filter(val => val % 2 === 0),
	.distinct(val => val),
)
observable.subscribe(val => console.log(val));

e) reduce() - mozna wykorzystac np. do sumowanie elementow strumienia. funckja reduce(acc, val) posiada 2 zmienne, acc zwane akumulatorem defaultowo jest rowne 0 jest i do niego bedziemy dodawac kolejno wartosci

const arr = [1,2,3,4,2,1,7,3,6,...];
const observable = from(arr).pipe(
	.filter(val => val % 2 === 0),
	.distinct(val => val),
	.reduce((acc, val) => acc + val),
)
observable.subscribe(val => console.log(val));

f) buffer() - jak nazwa wskazuje, funkcja ta bufforuje, bufforuje kolejne zdarzenie do czasu az otrzyma informacje, ze ma je przekazac dalej (sygnalem tym moze byc np. settimeout)

g) debounceTime() - wykorzystujac observable, ktory zamieni zdarzenie na strumien danych w polaczeniu z ta funkcja debounceTime() spowoduje ponowne wyslanie zdarzenie, jesli takowe nie nastapilo przed uplywem danego czasu (np. nikt nie kliknal w ciagu 300ms)

h) map() - standardowo, uzywamy jej do przeksztalcenia elementow tablicy

5. Biblioteki Rxjs mozna rowniez uzyc definiujac zrodlo danych ze zdarzenia. Najpierw musimy zdefiniowac przycisk w kodzie HTML, pozniej zamienic zdarzenie klikniecia w strumien (stream) zdarzen Rx, ktory to trzeba tez zasubskrybowac wykorzystujac metode fromEvent()

I.
<button id='my-button'>click!</button>
btn = document.getElementById('my-button')
clickObs = fromEvent(btn, 'click')
clickObs.subscribe(val => console.loc(val));

II.
<button id='another-button'>click!</button>
const anotherBtn = document.getElementById('another-button')
const clickObs = fromEvent(anotherBtn, 'click');
clickObs.pipe(
	buffer(clickObs.pipe(debounceTime(300))),
).subscribe(clicksArray => console.log('click!'));

Teraz zdarzenie przychodzi tylko raz, na koniec wielokrotnych klikniec. Funkcja buffer() zamienia pojedyncze zdarzenie (element) na tablice zbuforowanych zdarzen.

III.
<button id='another-button'>click!</button>
const anotherBtn = document.getElementById('another-button')
const clickObs = fromEvent(anotherBtn, 'click');
clickObs.pipe(
	buffer(clickObs.pipe(debounceTime(300))),
	map(clicksArray => clicksArray.length),
).subscribe(clicks => console.log('click x ' + clicks));

Dodajac funkcje map(), iterujac tablice zliczamy ja, a subskrybujac na koniec wyswietlamy liczbe klikniec. Programujac reaktywnie mozna w kilku linijkach przetworzyc wygenerowane przez uzytkownika zdarzenie. Do tak stworzonego obiektu observable mozna zasubskrybowac wiecej komponentow, ktore moga niezaleznie reagowac.


######### HANDLE REQUESTS WITH OBSERVABLES #########
USED METHODS FROM Rxjs LIBRARY
a) Subject - unique sort of Rxjs Observable, supports a specific value to be multicated to multiple Observers
b) tap - pipeable operator used to perform side effect as logging each value emitted by the source Observable
c) switchMap - widely used operator to get the latest value emitted by the observable
d) debounceTime - emits the latest value and helps in delaying the values transmitted by the root Observable for the specific time
e) distinctUntilChanged - returns an observable series that carries only distinguished adjacent (wyroznione sasiednie elementy) according to the key selector and the comparer

1. LIVE SEARCH

2. HTTP SERVICES WITH OBSERVABLE 
In this case I used API https://restcountries.eu/rest/v2/name/{name} to fetch the countries list.
Next, I inject HttpClient module in the constructor to make requests. Then I bind the Observable with search(term: string) method which takes a string entered by the user and will return an observable in which every item in the observable in Country[] list type. At the end with pipe operator I added error handling mechanism using previously declared handleError() method.

3. HTTP RESPONSE WITH OBSERVABLE AND RXJS OPERATORS
At first I define:
- loading as boolean,
- countries$ observable and mapped with Observable and 
- searchTerm as a private variable set as new SUbject(), it will emit the latest value entered by the user incorporating with search(term: string) {} method in the live country search module.
(1)    this.countries$ = this.searchTerms.pipe(
(2)      tap(_ => this.loading = true),
(3)      debounceTime(300),
(4)      distinctUntilChanged(),
(5)      switchMap((term: string) => this.countryService.searchCountry(term)),
(6)      tap(_ => this.loading = false)
      );
Later in ngOnInit() I bind variable countries$ with searchTerm Subject (1) along with pipeable operator (from rxjs). Inside pipe() I'm performing side effect with tap() method setting showing the loader, especially when the user enters any value (2). Sequentially I'm setting the delay for 300ms (3) and after that call distinctUntilChanged() method (4). Using switchMap() operator I'm taking the latest value and inside switchMap() method calling from my service searchCountry() passing the latest value (5). At the end, after request called, response returned, loader is hidden by setting it up to false (6).


4. DISPLAY DATA WITH ANGULAR ASYNC PIPE
At the beginning, let me write a little bit about the async pipe. So, ASYNC PIPE subscribes to an Observable or Promise and gets the most recent value. Async pipe signifies component (oznacza komponent), which should be examined (zbadany) for the latest emitted value. Additionally async pipe unsubscribes the observable and provide memory leakage protection when the component is destroyed.


######### COMPONENTS COMMUNICATION VIA SERVER #########
1. SERWIS (do przekazywania i wyswietlania wiadomosci string)
(1) ng g s ./data-service  // tworzymy DataService i dodajemy go w providers: [DataService] app.module albo bezposrednio w komponencie
(2)	private messageSource = new BehaviourSubject<string>('moja wiadomosc na dzien dobry');
(3)	currentMessage = this.messageSource.asObservable();
(4) changeMessage(message: string) { this.messageSource.next(message) }  // uzywane przez inne komponenty


2. DOWOLNY PIERWSZY KOMPONENT
(1) <p>{{message}}</p>
(2) message: string;
(3) constructor(private data: DataService) {}
(4) ngOnInit() { this.data.currentMessage.subscribe(message => this.message = message;) }  // tutaj pobieramy, zeby wyswietlic
(5) newMessage() { this.data.changeMessage('dobra noc wariat!') }; // i wywolujemy gdzies funkcje


3. DOWOLNY DRUGI KOMPONENT
w sumie to analogicznie, a nawet identycznie. kazdy komponent, ktory bedzie nasluchiwac, bedzie pobierac ostatnia sobie sobie ostatnio wartosc wiadomosci
