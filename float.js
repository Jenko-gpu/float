

mode = process.argv[2];


const { count } = require('console');
var fs = require('fs');

function to_float(raw){
    let num = new Array();
        
        for (i = 0; i<32; i++){
            num[i] = 0;
        }
        if (isNaN(raw)){
            for (i = 1; i<10;i++){
                num[i] = 1;
            }
            return num;
            //fs.writeFileSync('out.txt',num.join(''));
        } else {
        if (raw.charAt(0) == '-'){
            num[0] = 1;
        }
        let N = Number(raw.substring(num[0]));
        let p = 0;
        if (N>1){
            while (N<Math.pow(2,p) || N>=Math.pow(2,p+1)){
                p++;
            }

        } else{
            p = Math.floor(Math.log(N)/Math.log(2))
        }
        let P = 127 + p;
        if (P >= 0 && P<255){
            let M = N/Math.pow(2,p);
            let t = Number('0.'+String(M).substring(2));
            for (i = 0; i<23; i++){
                t *=2;
                num[9+i] = Math.floor(t);
                t = Number('0.'+String(t).substring(2));
                
            }
            i = 0;
            while (P>0 && i<8){
                num[8-i] = P%2;
                P = Math.floor(P/2);
                i++;
            }
            if (Math.floor(t*2)>0){
                i = 31;
                while (num[i] == 1 && i >= 9){
                    num[i] = 0;
                    i--;
                }
                if (i!=8){
                    num[i] = 1;
                } else{
                    i = 8;
                    while (i>0 && num[i]==1){
                        num[i] = 0;
                        i--;
                    }
                    num[i] = 1;
                }
                
            }
        } else if (P<0) {
            let M = N/Math.pow(2,p);
            let t = M;
            for (i = 0; i<23+P; i++){
                num[9-P+i] = Math.floor(t);
                t = Number('0.'+String(t).substring(2));
                t *=2;
            }
            if (num[31]==1){
                i = 31;
                while (num[i] == 1 && i >= 9){
                    num[i] = 0;
                    i--;
                }
                num[i] = 1;
            }
        } else{
            for (i = 1; i<9; i++){
                num[i] = 1;
            }
        }
        return num;

        }

}

String.prototype.count=function(c) { 
    var result = 0, i = 0;
    for(i;i<this.length;i++)if(this[i]==c)result++;
    return result;
  };

function indify(arr){
    x = 0;
    for (i = 1; i<10; i++){
        x+=arr[0];
    }
    return x;
}
NAN = '01111111110000000000000000000000';
INF = '1111111100000000000000000000000'
raw = fs.readFileSync('in.txt').toString().replaceAll(' ','');

mode = process.argv[2];
switch (mode) {
    case 'conv':
        let num = to_float(raw);
        fs.writeFileSync('out.txt',num.join(''));
    break;
    case 'calc':
        if ((raw.indexOf('-')>0 && raw.indexOf('+')>0) || (raw.count('-')>1)) {
            throw "Use only positive numbers.";
        }
        if (raw.indexOf('+')>-1){
            let nums = raw.split('+');

            let num_1 = to_float(nums[0]);
            let num_2 = to_float(nums[1]);
            if (indify(num_1)==9 || indify(num_2)==9){
                fs.writeFileSync('out.txt',NAN);
            } else
            if (indify(num_1)==8){
                if (indify(num_2)==8){
                    fs.writeFileSync('out.txt',NAN);
                }
                if (indify(num_2)!=8){
                    fs.writeFileSync('out.txt',num_1[0]+INF);
                }
            } else 
            if (indify(num_2)==8){
                if (indify(num_1)==8){
                    fs.writeFileSync('out.txt',NAN);
                }
                if (indify(num_1)!=8){
                    fs.writeFileSync('out.txt',num_1[0]+INF);
                }
            }
            else {
                p1 = 0;
                for (i = 1; i<9; i++){
                    p1 += num_1[i]*Math.pow(2,8-i);
                } p1-=127; // for debug
                p2 = 0;
                for (i = 1; i<9; i++){
                    p2 += num_2[i]*Math.pow(2,8-i);
                } p2-=127; // for debug
                if (p1>p2){
                    let dif = p1 - p2;
                    let pref = 0;
                    let num = new Array();
                    for (i = 0; i<32; i++){
                        num[i] = num_1[i];
                    }
                    for (i = 31; i>=9;i--){
                        if (i-dif>=9) {
                            if ((pref + num_1[i] + num_2[i-dif])%2 != 0){
                                num[i] = 1;
                            } else {
                                num[i] = 0;
                            }
                            if (pref + num_1[i] + num_2[i-dif] >= 2){
                                pref = 1;
                            } else {
                                pref = 0;
                            }
                        } else
                        if (i - dif == 8) { 
                            
                            if ((pref + num_1[i] + 1)%2 != 0){
                                num[i] = 1;
                            } else {
                                num[i] = 0;
                            }
                            if (pref + num_1[i] + 1 >= 2){
                                pref = 1;
                            } else {
                                pref = 0;
                            }
                        } else{
                            if ((pref + num_1[i] + 0)%2 != 0){
                                num[i] = 1;
                            } else {
                                num[i] = 0;
                            }
                            if (pref + num_1[i] + 0 >= 2){
                                pref = 1;
                            } else {
                                pref = 0;
                            }
                        }
                    }
                    if (pref == 1){
                        for (i = 31; i>10; i--){
                            num[i] = num[i-1]; 
                        }
                        num[10] = 0;
                        i = 8;
                        while (num[i]==1 && i>0){
                            num[i] = 0;
                            i--;
                        }
                        num[i] = 1;
                    }
                    fs.writeFileSync('out.txt', num.join(''));
                } else if (p2>p1){
                    let dif = p2 - p1;
                    let pref = 0;
                    let num = new Array();
                    for (i = 0; i<32; i++){
                        num[i] = num_2[i];
                    }
                    for (i = 31; i>=9;i--){
                        if (i-dif>=9) {
                            if ((pref + num_2[i] + num_1[i-dif])%2 != 0){
                                num[i] = 1;
                            } else {
                                num[i] = 0;
                            }
                            if (pref + num_2[i] + num_1[i-dif] >= 2){
                                pref = 1;
                            } else {
                                pref = 0;
                            }
                        } else
                        if (i - dif == 8) { 
                            
                            if ((pref + num_2[i] + 1)%2 != 0){
                                num[i] = 1;
                            } else {
                                num[i] = 0;
                            }
                            if (pref + num_2[i] + 1 >= 2){
                                pref = 1;
                            } else {
                                pref = 0;
                            }
                        } else{
                            if ((pref + num_2[i] + 0)%2 != 0){
                                num[i] = 1;
                            } else {
                                num[i] = 0;
                            }
                            if (pref + num_2[i] + 0 >= 2){
                                pref = 1;
                            } else {
                                pref = 0;
                            }
                        }
                    }
                    if (pref == 1){
                        for (i = 31; i>10; i--){
                            num[i] = num[i-1]; 
                        }
                        num[10] = 0;
                        i = 8;
                        while (num[i]==1 && i>0){
                            num[i] = 0;
                            i--;
                        }
                        num[i] = 1;
                    }
                    fs.writeFileSync('out.txt', num.join(''));
                }
            }

        } else if (raw.indexOf('-')>-1){
            let nums = raw.split('-');
            let num_1;
            let num_2;
            if (Number(nums[0])>Number(nums[1])){
                num_1 = to_float(nums[0]);
                num_2 = to_float(nums[1]);
            } else {
                num_2 = to_float(nums[0]);
                num_1 = to_float(nums[1]);
            }
            if (indify(num_1)==9 || indify(num_2)==9){
                fs.writeFileSync('out.txt',NAN);
            } else
            if (indify(num_1)==8){
                if (indify(num_2)==8){
                    fs.writeFileSync('out.txt',NAN);
                }
                if (indify(num_2)!=8){
                    fs.writeFileSync('out.txt',num_1[1]+INF);
                }
            } else 
            if (indify(num_2)==8){
                if (indify(num_1)==8){
                    fs.writeFileSync('out.txt',NAN);
                }
                if (indify(num_1)!=8){
                    fs.writeFileSync('out.txt',num_1[0]+INF);
                }
            } else {
                p1 = 0;
                for (let j = 1; j<9; j++){
                    p1 += num_1[j]*Math.pow(2,8-j);
                } p1-=127; // for debug
                p2 = 0;
                for (let i = 1; i<9; i++){
                    p2 += num_2[i]*Math.pow(2,8-i);
                } p2-=127; // for debug
                let dif = p1 - p2;
                let shift = false;
                for (let i = Math.min(0,8-dif); i<8; i++){
                    num_2[i] = 0;
                }
                for (let i = 32; i < 32+dif; i++){
                    num_1[i] = 0;
                }
                num_2[8] = 1;
                let i = 31+dif;
                let j = 0;

                while (i!=8){
                    if (num_1[i]-num_2[i-dif]>=0){
                        num_1[i] = num_1[i]-num_2[i-dif];
                        num_2[i-dif] = 0;
                        i--;
                    } else if ( num_1[i]>num_2[i-dif] ) {
                        i--;
                    } else {
                        j = i-1;
                        while (j!=i){
                            while ( j>8 && num_1[j]-num_2[j-dif]!=1 ) {

                                if ( num_1[j]==num_2[j-dif] ) {
                                    num_1[j] = 0
                                    num_2[j-dif] = 0;
                                }
                                j--;
                            }
                            if (j == 8) {
                                shift = true;
                            } else{
                                num_1[j] = 0
                            }
                            j++;
                            let start = j;
                            while (j<i){
                                if (num_2[j-dif]==1) {
                                    num_2[j-dif]=0; 
                                    if(num_1[j]==0){
                                        num_1[j]=0;
                                    } 
                                }
                                else{
                                    num_1[j]=1;
                                    
                                }
                                j++;
                            }
                            num_2[j-dif] = 0;
                            num_1[j] = 1;
                        }
                        i--;
                    }
                }

                if (shift){

                    let i = 1;
                    while (num_1[8+i]!=1){
                        i++;
                    }
                    let k = p1 - i + 127;
                    for (let j = 9; j<num_1.length-1; j++){
                        num_1[j] = num_1[j+i];
                    }
                    if (num_1.length-i<32){
                        for (let j = num_1.length-i; j<32; j++){
                            num_1[j] = 1;
                        }
                    }
                    i = 8;
                    while (i>0){
                        num_1[i] = k%2;
                        k = Math.floor(k/2);
                        i--;
                    }
                }

                fs.writeFileSync('out.txt',num_1.join('').slice(0,32));
            }
        } else {
            throw "Something went wrong.";
        }
    break;
}