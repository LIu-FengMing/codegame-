/* 三星:5個動作包含5個動作以內  
   二星:6個動作包含6個動作以內5個動作以上  
   一星限為滿足過關條件即可*/ 


#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void clear(){
turnRight();
step();
turnLeft();
step();
}
    
   
void a(){
    int i;
for(i=5;i>0;i--){
clear();

}
}


int main(int argc, char *argv[])
{

a();

	return 0;
 }


