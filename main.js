

const $board=$('#board');

var ROWS=25;
var COLS=25;


function createBoardH(rows,cols){
    $board.empty();
 for(let i=0;i<rows;i++){
      const $row=$('<div>').addClass('row');
      for(let j=0;j<cols;j++){
          const $col =$('<div>').addClass('col hidden')
          .attr('data-row',i)
          .attr('data-col',j);   
          $row.append($col);
          
      }
     
      $board.append($row);
      hadamardMine();    
 } 
}
function createBoardN(rows,cols){
    $board.empty();
 for(let i=0;i<rows;i++){
      const $row=$('<div>').addClass('row');
      for(let j=0;j<cols;j++){
          const $col =$('<div>').addClass('col hidden')
          .attr('data-row',i)
          .attr('data-col',j);
            if(Math.random()<0.1){
                $col.addClass('mine');
            }
          $row.append($col);
      }
      $board.append($row);
 }
}

function hadamardMine(){
      $('[data-row*=1][data-col*=1]').addClass('mine');
      $('[data-row*=1][data-col*=3]').addClass('mine');
      $('[data-row*=1][data-col*=5]').addClass('mine');
      $('[data-row*=1][data-col*=7]').addClass('mine');
      $('[data-row*=2][data-col*=2]').addClass('mine');
      $('[data-row*=2][data-col*=3]').addClass('mine');
      $('[data-row*=2][data-col*=6]').addClass('mine');
      $('[data-row*=2][data-col*=7]').addClass('mine');
      $('[data-row*=3][data-col*=1]').addClass('mine');
      $('[data-row*=3][data-col*=2]').addClass('mine');
      $('[data-row*=3][data-col*=5]').addClass('mine');
      $('[data-row*=3][data-col*=6]').addClass('mine');
      $('[data-row*=4][data-col*=4]').addClass('mine');
      $('[data-row*=4][data-col*=5]').addClass('mine');
      $('[data-row*=4][data-col*=6]').addClass('mine');
      $('[data-row*=4][data-col*=7]').addClass('mine');
      $('[data-row*=5][data-col*=1]').addClass('mine');
      $('[data-row*=5][data-col*=3]').addClass('mine');
      $('[data-row*=5][data-col*=4]').addClass('mine');
      $('[data-row*=5][data-col*=6]').addClass('mine');
      $('[data-row*=6][data-col*=2]').addClass('mine');
      $('[data-row*=6][data-col*=3]').addClass('mine');
      $('[data-row*=6][data-col*=4]').addClass('mine');
      $('[data-row*=6][data-col*=5]').addClass('mine');
      $('[data-row*=7][data-col*=1]').addClass('mine');
      $('[data-row*=7][data-col*=2]').addClass('mine');
      $('[data-row*=7][data-col*=4]').addClass('mine');
      $('[data-row*=7][data-col*=7]').addClass('mine');
}




function restart(){
    var userChoice=prompt('Which Minesweeper You Wish to Play\nEnter\n1 for Normal MineSweeper\n2 for Hadamard MineSweeper');
    
    var n=getSize();  
    if(userChoice==1)createBoardN(n,n);
    else createBoardH(n,n);
    $("body").removeClass("game-over");
    $("#level-title").text("Click anywhere on the board");


   

}
function getSize(){
   var n= prompt('Which N X N size you wish to play.\n(For Hadamard Choose from 2,4,and 8)');
   return n;
}

function gameOver(isWin){
    let message =null;
    let icon=null;
    if(isWin){
        message='YOU WON!🏆';
        icon='fa fa-flag';
        $("#level-title").text("YOU WON!🏆");
        var audio = new Audio("sounds/win.mp3");
        audio.play();


        
    }
    else{
        message='YOU LOST!☹️';
        icon='fa fa-bomb';
        $("body").addClass("game-over");
      $("#level-title").text("YOU LOST!☹️");
      
        
        
    }
    $('.col.mine').append($('<i>').addClass(icon));
    $('.col:not(.mine)')
        .html(function(){
            const $cell=$(this);
            const count=getMineCount(
                $cell.data('row'),
                $cell.data('col'),
            );
            return count=== 0 ? '': count;
        })
        $('.col.hidden').removeClass('hidden');
    setTimeout(function(){
          alert(message);
        
        restart();
    },100);
}

function reveal(oi,oj){
    const seen={};

    function helper(i,j){
        if(i>=ROWS || j>=COLS || i<0 || j<0)return;
        const key=`${i} ${j}`
        if(seen[key])return;
        const $cell=
        $(`.col.hidden[data-row=${i}][data-col=${j}]`);
        const mineCount = getMineCount(i,j);
        if(
            !$cell.hasClass('hidden') ||
            $cell.hasClass('mine')
        ){
            return;
        }
        $cell.removeClass('hidden');
        if(mineCount){
            $cell.text(mineCount);
            return;
        }
        for(let di= -1;di<=1;di++)
        {
            for(let dj=-1;dj<=1;dj++){
                helper(i + di,j+dj);
            }
        }
    }
    helper(oi,oj);
}

function getMineCount(i,j){
    let count=0;
    for(let di= -1;di<=1;di++)
        {
            for(let dj=-1;dj<=1;dj++){
                const ni=i+di;
                const nj=j+dj;
                if(ni>=ROWS || nj>= COLS || ni<0 || nj<0)continue;
                const $cell=$(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
                if($cell.hasClass('mine'))count++;
                
            }
        }
        return count;
}

$board.on('click','.col.hidden',function(){
    const $cell=$(this);
    const row=$cell.data('row');
    const col=$cell.data('col');
        var audio = new Audio("sounds/CClick.mp3");
        audio.play();
  
    if($cell.hasClass('mine')){
        gameOver(false);
        var audio = new Audio("sounds/wrong.mp3");
        audio.play();
    }
    else{
        reveal(row,col);
        const isGameOver=$('.col.hidden').length === $('.col.mine').length;
        if(isGameOver)gameOver(true);
        
    }
})

restart();