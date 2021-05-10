const tic_tac_toe = {
    board: ['','','','','','','','',''],
    symbols: {
        options: ['X','O'],
        turn_index: 0,
        change: function(){
            this.turn_index = (this.turn_index === 0) ? 1 : 0;
        }
    },
    container_element: null,
    gameover: false,
    winning_sequences: [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ],
    init: function(container){
        this.container_element = container;
    },
    start: function(){
        this.board.fill('');
        document.querySelector('.btn').style.display = 'none';
        document.querySelector('.game').style.display = 'grid';
        this.draw();
        this.gameover = false;
    },
    draw: function(){
        let content = '';
        for( i in this.board ){
            content += `<div onclick='tic_tac_toe.make_play(${i})'>${this.board[i]}</div>`;
        }
        this.container_element.innerHTML = content;
    },
    make_play: function(position){
        if(this.gameover) return false
        if(this.board[position] == ''){
            this.board[position] = this.symbols.options[this.symbols.turn_index];
            this.draw();
            let winning_sequences_index = this.check_winning_sequences(this.symbols.options[this.symbols.turn_index])
            if(winning_sequences_index >=0){
                this.game_is_over(this.symbols.options[this.symbols.turn_index]);
            } else {
                this.symbols.change();
            }
            this.check_board_full();
            return true;
        } else {
            return false;
        }
    },
    check_winning_sequences: function(symbol){
        for(i in this.winning_sequences){
            if(this.board[this.winning_sequences[i][0]] == symbol &&
                this.board[this.winning_sequences[i][1]] == symbol &&
                this.board[this.winning_sequences[i][2]] == symbol){
                    document.querySelector('.game').children[this.winning_sequences[i][0]].style.backgroundColor = '#AB813C'
                    document.querySelector('.game').children[this.winning_sequences[i][1]].style.backgroundColor = '#AB813C'
                    document.querySelector('.game').children[this.winning_sequences[i][2]].style.backgroundColor = '#AB813C'
                    return  i;
            }    
        }
        return -1;
    },
    check_board_full: function(){
        let cont = 0;
        for(i in this.board){
            if(this.board[i] != ''){
                cont++
            }
        }
        if(cont == 9){
            this.game_tie();
        }
    },
    game_is_over: function(symbol){
        this.gameover = true;
        alert(`${symbol} GANHOU!`);
        document.querySelector('.btn').style.display = 'block';
        document.querySelector('.game').style.display = 'none';
    },
    game_tie: function(){
        this.gameover = true;
        alert("EMPATOU")
        document.querySelector('.btn').style.display = 'block';
        document.querySelector('.game').style.display = 'none';
    }
};


tic_tac_toe.init(document.querySelector('.game'));
tic_tac_toe.start()