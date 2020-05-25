#include <vector>
#include <iostream>
#include <math.h>
#define SIZE 256
using namespace std;
string system_mapstr;
int system_map[20][20][2] = {0}; // ex: x,y=5,3 system_map[5][3][0]  [1]為元件位置
int systObjMax = 0, systemObj[2048] = {0}, systObjNowL = 0;
int system_mapsize;
vector<int> triggerX, triggerY, tableArrX, tableArrY, boxX, boxY; //x,y
vector<string> triggerString, boxString;
vector< vector<int> > tableArray(4);
vector< vector<int> > boxArray(4);
int tableArr[4];
int boxArr[4];
char boxAns[4];
char err[4] = "err";
int peopleAdr[7] = {}; // 0 1 2 xyz  hp armor atk  car0tank1bot2
int stepValue[5][2] = {{1, 0}, {0, -1}, {-1, 0}, {0, 1}, {0, 0}}; // x,y
int mytest;
char hint = 'X';
char testChar = 'Z';
string testStr;

void actionJudgeNowAdr()
{
	int x = peopleAdr[0], y = peopleAdr[1];
	int var = system_map[y][x][0] % 100;
	hint = 'X';
    testStr = "space";
    testChar = 'Z';
    
    if (var == 7)
    {
        for (int i = 0; i < triggerX.size(); i++) {
            if (triggerX[i] == x && triggerY[i] == y) {
                testStr = triggerString[i];
                testChar = testStr[0];
            }
        }
    }
  

	if (x < 0 || y < 0 || x >= system_mapsize || y >= system_mapsize)
	{
		cout << "$E,,3"; //駛出地圖
	}
	else if (var == 1 || (var >= 2 && var <=5) || var == 6 || var == 8 || var == 9)
	{
		cout << "$E,,4"; //撞到障礙物
	}
	else if (var == 50 || var == 51)
	{						  //終點線
		cout << "$E,,2"; //抵達終點
	}
}
void actionJudgeNextAdr(int x, int y)
{
	int nx = x + stepValue[peopleAdr[2]][0], ny = y + stepValue[peopleAdr[2]][1];
	int varS = system_map[ny][nx][0] % 100;
	if (varS == 8)
    {
            for(int i=0; i<tableArrX.size(); i++)
            {
                if(tableArrX[i] == nx && tableArrY[i] == ny)
                {
                    for(int j=0; j<4; j++)
                    {
                        tableArr[j] = tableArray[i][j];
                    }
                    break;
                }
            }
    }
    else if(varS == 9)
    {
        int temp = system_map[ny][nx][1];
        for(int i=0; i<boxX.size(); i++)
        {
            if(boxX[i] == nx && boxY[i] == ny)
            {
                for(int j=0; j<4; j++)
                {
                    boxArr[j] = boxArray[i][j];
                    boxAns[j] = boxString[i][j];
                }
                break;
            }
        }
        mytest = temp;
    }
	for (int i = 0; i < 4; ++i)
	{
		int var = system_map[y + stepValue[i][1]][x + stepValue[i][0]][0] % 100;
		if (var == 6)
		{ // 6  為輸出鎖頭
			cout << "$I,," << x + stepValue[i][0] << "," << y + stepValue[i][1] << ",,";
			break;
		}
        else if (var >= 2 && var <= 5)
        {
            var = var - 1;
			cout << "$S,," << var;
			break;
        }
	}
}
void moveForward()
{
	int dx = peopleAdr[0], dy = peopleAdr[1];
	int mapEvloution = (system_map[dy][dx][0] / 100) - 1;
	hint = 'X';
	if (peopleAdr[6] == mapEvloution)
	{
		int addx = stepValue[peopleAdr[2]][0];
		int addy = stepValue[peopleAdr[2]][1];
		peopleAdr[0] += addx;
		peopleAdr[1] += addy;
		
		cout << "$M,,-1,," << addx << "," << addy << ",0";
		actionJudgeNowAdr();
		actionJudgeNextAdr(peopleAdr[0], peopleAdr[1]);
	}
	else
	{
		cout << "$M,,-1,,0,0,0";
	}
}
void turnRight()
{
	int dx = peopleAdr[0], dy = peopleAdr[1];
	int mapEvloution = (system_map[dy][dx][0] / 100) - 1;
	if (peopleAdr[6] == mapEvloution)
	{
		cout << "$M,,-1,,0,0,-1";
		peopleAdr[2] = (peopleAdr[2] + 3) % 4;
		actionJudgeNowAdr();
		actionJudgeNextAdr(dx, dy);
	}
	else
	{
		cout << "$M,,-1,,0,0,0";
	}
}
void turnLeft()
{
	int dx = peopleAdr[0], dy = peopleAdr[1];
	int mapEvloution = (system_map[dy][dx][0] / 100) - 1;
	if (peopleAdr[6] == mapEvloution)
	{
		cout << "$M,,-1,,0,0,1";
		peopleAdr[2] = (peopleAdr[2] + 1) % 4;
		actionJudgeNowAdr();
		actionJudgeNextAdr(dx, dy);
	}
	else
	{
		cout << "$M,,-1,,0,0,0";
	}
}
void input_init()
{

	//system_map string
	int x = 0, y = 0, r = 0, num = 0, hp, armor, atk, type;
    int n = 0, m = 0;
	string temp;
	cin >> system_mapstr;
	system_mapsize = sqrt(system_mapstr.length());
	for (int i = 0; i < system_mapsize; ++i)
	{
		for (int j = 0; j < system_mapsize; ++j)
		{
			if (system_mapstr[i * system_mapsize + j] == '0')
			{
				system_map[i][j][0] += 100;
			}
			else if (system_mapstr[i * system_mapsize + j] == '1')
			{
				system_map[i][j][0] += 200;
			}
			else if (system_mapstr[i * system_mapsize + j] == '2')
			{
				system_map[i][j][0] += 300;
			}
		}
	}
	systObjMax = system_mapsize * system_mapsize + 10;
	for (int i = 0; i < systObjMax; i++)
	{
		systemObj[i] = i;
	}

	cin >> x >> y >> r >> hp >> armor >> atk >> type;
	peopleAdr[0] = x, peopleAdr[1] = y, peopleAdr[2] = r;
	peopleAdr[3] = hp, peopleAdr[4] = armor, peopleAdr[5] = atk;
	peopleAdr[6] = type;
	cin >> num;
	for (int i = 0; i < num; ++i)
	{
		cin >> x >> y >> r;
		system_map[y][x][0] += r + 50; //50- 51| 為終點線
	}
	cin >> num;
	systObjNowL = num;
	for (int i = 0; i < num; ++i)
	{
		cin >> temp;
		cin >> x >> y;
		if (temp == "stone" || temp == "unmoveble" || temp == "statue" || temp == "loop_door" || temp == "loop_done")
		{
			system_map[y][x][0] += 1; //1 為障礙物
			system_map[y][x][1] = i;
		}
		
		else if (temp == "door" || temp == "loop_flame")
		{
			system_map[y][x][0] += 6; //6  為輸出答案
			system_map[y][x][1] = i;
		}
        else if (temp == "rune_table")
        {
            cin >> r;
            system_map[y][x][0] += 2 + r; // 2 3 4 5  為輸入編號
			system_map[y][x][1] = i;
        }
        else if (temp == "trigger")
        {
            cin >> temp;
            triggerString.push_back(temp);
            triggerX.push_back(x);
            triggerY.push_back(y);
            system_map[y][x][0] += 7;  // 7 為觸發器
			system_map[y][x][1] = i;
        }
        else if (temp == "array_table")
        {
            for(int k=0; k<4; k++){
                cin >> r;
                tableArray[n].push_back(r);
            }
            tableArrX.push_back(x);
            tableArrY.push_back(y);
            system_map[y][x][0] += 8; // 8 為陣列接收 
            system_map[y][x][1] = i;
            n++;
        }
        else if (temp == "box_closed")
        {
            for(int k=0; k<4; k++){
                cin >> r;
                boxArray[m].push_back(r);
            }
            cin >> temp;
            boxString.push_back(temp);
            boxX.push_back(x);
            boxY.push_back(y);
            system_map[y][x][0] += 9;  // 9 為箱子 
            system_map[y][x][1] = i;
            m++;
        }
	}

    actionJudgeNextAdr(peopleAdr[0], peopleAdr[1]);
	
}
void getArray(int arr[])
{
    for(int i=0; i<4; i++)
    {
        arr[i]=tableArr[i];
    }
}
char* openBox(int arr[])
{   
    bool boxFlag = true;
    for(int i=0; i<4; i++)
    {
        if(arr[i]!=boxArr[i]){
            boxFlag = false;
        	break;
		}
    }
    if(boxFlag){
        //cout << "$C,," << mytest << ",,box_open ";
        return boxAns;
    }else{
        return err;
    }
    
}