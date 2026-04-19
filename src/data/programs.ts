export const C_CODE = {
  program1: `#include<stdio.h>
#include<stdlib.h>

struct Day {
    char *dayName;
    int date;
    char *activity;
};

void create(struct Day *day) {
    day->dayName = (char *)malloc(sizeof(char) * 20);
    day->activity = (char *)malloc(sizeof(char) * 100);
    printf("Enter the day name: ");
    scanf("%s", day->dayName);
    printf("Enter the date: ");
    scanf("%d", &day->date);
    printf("Enter the activity for the day: ");
    scanf(" %[^\\n]s", day->activity);
}

void read(struct Day *calendar, int size) {
    for (int i = 0; i < size; i++) {
        printf("Enter details for Day %d:\\n", i + 1);
        create(&calendar[i]);
    }
}

void display(struct Day *calendar, int size) {
    printf("\\nWeek's Activity Details:\\n");
    for (int i = 0; i < size; i++) {
        printf("Day %d:\\n", i + 1);
        printf("Day Name: %s\\n", calendar[i].dayName);
        printf("Date: %d\\n", calendar[i].date);
        printf("Activity: %s\\n", calendar[i].activity);
        printf("\\n");
    }
}

int main() {
    int size;
    printf("Enter the number of days in the week: ");
    scanf("%d", &size);
    struct Day *calendar = (struct Day *)malloc(sizeof(struct Day) * size);
    if (calendar == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }
    read(calendar, size);
    display(calendar, size);
    free(calendar);
    return 0;
}`,
  program2: `#include<stdio.h>

char str[50], pat[20], rep[20], res[50];
int c = 0, m = 0, i = 0, j = 0, k, flag = 0;

void stringmatch() {
    while (str[c] != '\\0') {
        if (str[m] == pat[i]) {
            i++; m++;
            if (pat[i] == '\\0') {
                flag = 1;
                for (k = 0; rep[k] != '\\0'; k++, j++)
                    res[j] = rep[k];
                i = 0; c = m;
            }
        } else {
            res[j] = str[c];
            j++; c++; m = c; i = 0;
        }
    }
    res[j] = '\\0';
}

void main() {
    printf("Enter the main string:"); gets(str);
    printf("\\nEnter the pat string:"); gets(pat);
    printf("\\nEnter the replace string:"); gets(rep);
    stringmatch();
    if (flag == 1) printf("\\nThe string after pattern match and replace is: \\n %s ", res);
    else printf("\\nPattern string is not found");
}`,
  program3: `#include<stdio.h>
#include<stdlib.h>
#define MAX 3

int s[MAX];
int top = -1;

void push(int item);
int pop();
void palindrome();
void display();

void main() {
    int choice, item;
    while (1) {
        printf("\\n\\n-----------Menu----------- : ");
        printf("\\n1.Push 2.Pop 3.Palindrome 4.Display 5.Exit\\nChoice: ");
        scanf("%d", &choice);
        switch (choice) {
        case 1: printf("Element: "); scanf("%d", &item); push(item); break;
        case 2: item = pop(); if (item != -1) printf("Popped: %d", item); break;
        case 3: palindrome(); break;
        case 4: display(); break;
        case 5: exit(0);
        default: printf("Invalid");
        }
    }
}`,
  program4: `#include<stdio.h>
#include<ctype.h>

char stack[100];
int top = -1;

void push(char x) { stack[++top] = x; }
char pop() { if(top == -1) return -1; return stack[top--]; }

int priority(char x) {
    if(x == '(') return 0;
    if(x == '+' || x == '-') return 1;
    if(x == '*' || x == '/' || x == '%') return 2;
    if(x == '^') return 3;
    return 0;
}

void main() {
    char exp[100];
    char *e, x;
    printf("Enter the expression : ");
    scanf("%s",exp);
    e = exp;
    while(*e != '\\0') {
        if(isalnum(*e)) printf("%c",*e);
        else if(*e == '(') push(*e);
        else if(*e == ')') {
            while((x = pop()) != '(') printf("%c", x);
        } else {
            while(priority(stack[top]) >= priority(*e)) printf("%c",pop());
            push(*e);
        }
        e++;
    }
    while(top != -1) printf("%c",pop());
}`,
  program5a: `#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#include<ctype.h>

int i, top = -1;
int op1, op2, res, s[20];
char postfix[90], symb;

void push(int item) { s[++top] = item; }
int pop() { return s[top--]; }

void main() {
    printf("Enter valid postfix expression:\\n");
    scanf("%s", postfix);
    for (i = 0; postfix[i] != '\\0'; i++) {
        symb = postfix[i];
        if (isdigit(symb)) push(symb - '0');
        else {
            op2 = pop(); op1 = pop();
            switch (symb) {
            case '+': push(op1 + op2); break;
            case '-': push(op1 - op2); break;
            case '*': push(op1 * op2); break;
            case '/': push(op1 / op2); break;
            case '%': push(op1 % op2); break;
            case '^': push(pow(op1, op2)); break;
            }
        }
    }
    res = pop();
    printf("Result = %d", res);
}`,
  program5b: `#include <stdio.h>
#include <math.h>

void tower(int n, int source, int temp, int destination) {
    if (n == 0) return;
    tower(n - 1, source, destination, temp);
    printf("\\nMove disc %d from %c to %c", n, source, destination);
    tower(n - 1, temp, source, destination);
}
void main() {
    int n;
    printf("\\nEnter the number of discs: ");
    scanf("%d", & n);
    tower(n, 'A', 'B', 'C');
    printf("\\nTotal Moves: %d", (int) pow(2, n) - 1);
}`,
  program6: `#include<stdio.h>
#include<stdlib.h>

#define MAX 5

char circular_queue[MAX];
int front = -1, rear = -1;

int isEmpty()
{
    if (front == -1 && rear == -1)
        return 1;
    else
        return 0;
}

int isFull()
{
    if ((rear + 1) % MAX == front)
        return 1;
    else
        return 0;
}

void insertElement(char element)
{
    if (isFull())
    {
        printf("Circular Queue Overflow\\n");
        return;
    }
    else if (isEmpty())
    {
        front = rear = 0;
    }
    else
    {
        rear = (rear + 1) % MAX;
    }
    circular_queue[rear] = element;
}

void deleteElement()
{
    if (isEmpty())
    {
        printf("Circular Queue Underflow\\n");
        return;
    }
    else if (front == rear)
    {
        front = rear = -1;
    }
    else
    {
        front = (front + 1) % MAX;
    }
}

void display()
{
    int i;
    if (isEmpty())
    {
        printf("Circular Queue is empty\\n");
        return;
    }
    printf("Circular Queue elements: ");
    i = front;
    do
    {
        printf("%c ", circular_queue[i]);
        i = (i + 1) % MAX;
    }
    while (i != (rear + 1) % MAX);
    printf("\\n");
}

int main()
{
    int choice;
    char element;
    do
    {
        printf("\\n\\n---- Circular Queue Menu ----\\n");
        printf("1. Insert an Element\\n");
        printf("2. Delete an Element\\n");
        printf("3. Display Circular Queue\\n");
        printf("4. Exit\\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch(choice)
        {
        case 1:
            printf("Enter element to be inserted: ");
            scanf(" %c", &element);
            insertElement(element);
            break;
        case 2:
            deleteElement();
            break;
        case 3:
            display();
            break;
        case 4:
            printf("Exiting...\\n");
            break;
        default:
            printf("Invalid choice! Please enter a valid option.\\n");
        }
    }
    while(choice != 4);

    return 0;
}`,
  program7: `#include<stdio.h>
#include<stdlib.h>

struct node
{
    char usn[25], name[25], branch[25];
    int sem;
    long int phone;
    struct node * link;
};
typedef struct node * NODE;

NODE start = NULL;
int count = 0;

NODE create()
{
    NODE snode;
    snode = (NODE) malloc(sizeof(struct node));

    if (snode == NULL)
    {
        printf("\\nMemory is not available");
        exit(1);
    }
    printf("\\nEnter the usn,Name,Branch, sem,PhoneNo of the student:");
    scanf("%s %s %s %d %ld", snode -> usn, snode -> name, snode -> branch, & snode -> sem, & snode -> phone);
    snode -> link = NULL;
    count++;
    return snode;
}

NODE insertfront()
{
    NODE temp;
    temp = create();
    if (start == NULL)
    {
        return temp;
    }

    temp -> link = start;
    return temp;
}

NODE deletefront()
{
    NODE temp;
    if (start == NULL)
    {
        printf("\\nLinked list is empty");
        return NULL;
    }

    if (start -> link == NULL)
    {
        printf("\\nThe Student node with usn:%s is deleted ", start -> usn);
        count--;
        free(start);
        return NULL;
    }
    temp = start;
    start = start -> link;
    printf("\\nThe Student node with usn:%s is deleted", temp -> usn);
    count--;
    free(temp);
    return start;
}

NODE insertend()
{
    NODE cur, temp;
    temp = create();

    if (start == NULL)
    {
        return temp;
    }
    cur = start;
    while (cur -> link != NULL)
    {
        cur = cur -> link;
    }
    cur -> link = temp;
    return start;
}

NODE deleteend()
{
    NODE cur, prev;
    if (start == NULL)
    {
        printf("\\nLinked List is empty");
        return NULL;
    }

    if (start -> link == NULL)
    {
        printf("\\nThe student node with the usn:%s is deleted", start -> usn);
        free(start);
        count--;
        return NULL;
    }

    prev = NULL;
    cur = start;
    while (cur -> link != NULL)
    {
        prev = cur;
        cur = cur -> link;
    }

    printf("\\nThe student node with the usn:%s is deleted", cur -> usn);
    free(cur);
    prev -> link = NULL;
    count--;
    return start;
}

void display()
{
    NODE cur;
    int num = 1;

    if (start == NULL)
    {

        printf("\\nNo Contents to display in SLL \\n");
        return;
    }
    printf("\\nThe contents of SLL: \\n");
    cur = start;
    while (cur != NULL)
    {
        printf("\\n|%d| |USN:%s| |Name:%s| |Branch:%s| |Sem:%d| |Ph:%ld|", num, cur -> usn, cur -> name, cur -> branch, cur -> sem, cur -> phone);
        cur = cur -> link;
        num++;
    }
    printf("\\n No of student nodes is %d \\n", count);
}

void stackdemo()
{
    int ch;
    while (1)
    {
        printf("\\n--------Stack Demo using SLL--------\\n");
        printf("\\n1:Push operation \\n2: Pop operation \\n3: Display \\n4:Exit \\n");
        printf("\\nEnter your choice for stack demo:");
        scanf("%d", & ch);

        switch (ch)
        {
        case 1:
            start = insertfront();
            break;
        case 2:
            start = deletefront();
            break;
        case 3:
            display();
            break;
        default:
            return;
        }
    }
    return;
}

int main()
{
    int ch, i, n;
    while (1)
    {
        printf("\\n--------Menu--------");
        printf("\\nEnter your choice for SLL operation \\n");
        printf("\\n1:Create SLL of Student Nodes");
        printf("\\n2:DisplayStatus");
        printf("\\n3:InsertAtEnd");
        printf("\\n4:DeleteAtEnd");
        printf("\\n5:Stack Demo using SLL(Insertion and Deletion at Front)");
        printf("\\n6:Exit \\n");
        printf("\\nEnter your choice:");
        scanf("%d", & ch);

        switch (ch)
        {
        case 1:
            printf("\\nEnter the no of students: ");
            scanf("%d", & n);
            for (i = 1; i <= n; i++)
                start = insertfront();
            break;

        case 2:
            display();
            break;

        case 3:
            start = insertend();
            break;

        case 4:
            start = deleteend();
            break;

        case 5:
            stackdemo();
            break;

        case 6:
            exit(0);

        default:
            printf("\\nPlease enter the valid choice");

        }
    }
}`,
  program8: `#include<stdio.h>
#include<stdlib.h>

struct node
{
    char ssn[25], name[25], dept[10], designation[25];
    int sal;
    long int phone;
    struct node * llink;
    struct node * rlink;
};
typedef struct node * NODE;

NODE first = NULL;
int count = 0;

NODE create()
{
    NODE enode;
    enode = (NODE) malloc(sizeof(struct node));
    if (enode == NULL)
    {
        printf("\\n Running out of memory ");
        exit(0);
    }
    printf("\\n Enter the ssn,Name,Department,Designation,Salary,PhoneNo of the employee: \\n");
    scanf("%s %s %s %s %d %ld", enode -> ssn, enode -> name, enode -> dept, enode -> designation, & enode -> sal, & enode -> phone);
    enode -> llink = NULL;
    enode -> rlink = NULL;
    count++;
    return enode;
}

NODE insertfront()
{
    NODE temp;
    temp = create();
    if (first == NULL)
    {
        return temp;
    }
    temp -> rlink = first;
    first -> llink = temp;
    return temp;
}

void display()
{
    NODE cur;
    int nodeno = 1;
    cur = first;
    if (cur == NULL)
        printf("\\nNo Contents to display in DLL ");
    while (cur != NULL)
    {
        printf("\\nENode:%d|SSN:%s| |Name:%s| |Department:%s| |Designation:%s| |Salary:%d| |Phone no:%ld|", nodeno, cur -> ssn, cur -> name, cur -> dept, cur -> designation, cur -> sal, cur -> phone);
        cur = cur -> rlink;
        nodeno++;
    }
    printf("\\nNo of employee nodes is %d", count);
}

NODE deletefront()
{
    NODE temp;
    if (first == NULL)
    {
        printf("\\nDoubly Linked List is empty ");
        return NULL;
    }
    if (first -> rlink == NULL)
    {
        printf("\\nThe employee node with the ssn:%s is deleted ", first -> ssn);
        free(first);
        count--;
        return NULL;
    }
    temp = first;
    first = first -> rlink;
    temp -> rlink = NULL;
    first -> llink = NULL;
    printf("\\nThe employee node with the ssn:%s is deleted ", temp -> ssn);
    free(temp);
    count--;
    return first;
}

NODE insertend()
{
    NODE cur, temp;
    temp = create();

    if (first == NULL)
    {
        return temp;
    }
    cur = first;
    while (cur -> rlink != NULL)
    {
        cur = cur -> rlink;
    }

    cur -> rlink = temp;
    temp -> llink = cur;
    return first;
}

NODE deleteend()
{
    NODE prev, cur;
    if (first == NULL)
    {
        printf("\\nDoubly Linked List is empty ");
        return NULL;
    }

    if (first -> rlink == NULL)
    {
        printf("\\nThe employee node with the ssn:%s is deleted ", first -> ssn);
        free(first);
        count--;
        return NULL;
    }

    prev = NULL;
    cur = first;

    while (cur -> rlink != NULL)
    {
        prev = cur;
        cur = cur -> rlink;
    }

    cur -> llink = NULL;
    printf("\\nThe employee node with the ssn:%s is deleted ", cur -> ssn);
    free(cur);
    prev -> rlink = NULL;
    count--;
    return first;
}

void deqdemo()
{
    int ch;
    while (1)
    {
        printf("\\nDemo Double Ended Queue Operation ");
        printf("\\n1:InsertQueueFront\\n 2: DeleteQueueFront\\n 3:InsertQueueRear\\n 4:DeleteQueueRear\\n 5:DisplayStatus\\n 6: Exit \\n");
        scanf("%d", & ch);

        switch (ch)
        {
        case 1:
            first = insertfront();
            break;
        case 2:
            first = deletefront();
            break;
        case 3:
            first = insertend();
            break;
        case 4:
            first = deleteend();
            break;
        case 5:
            display();
            break;
        default:
            return;
        }
    }
}

void main()
{
    int ch, i, n;
    while (1)
    {
        printf("\\n\\n--------Menu--------");
        printf("\\n1:Create DLL of Employee Nodes ");
        printf("\\n2:DisplayStatus");
        printf("\\n3:InsertAtEnd");
        printf("\\n4:DeleteAtEnd");
        printf("\\n5:InsertAtFront");
        printf("\\n6:DeleteAtFront");
        printf("\\n7:Double Ended Queue Demo using DLL ");
        printf("\\n8:Exit \\n");
        printf("\\nPlease enter your choice: ");
        scanf("%d", & ch);

        switch (ch)
        {
        case 1:
            printf("\\nEnter the no of Employees: ");
            scanf("%d", & n);
            for (i = 1; i <= n; i++)
                first = insertend();
            break;

        case 2:
            display();
            break;

        case 3:
            first = insertend();
            break;

        case 4:
            first = deleteend();
            break;

        case 5:
            first = insertfront();
            break;

        case 6:
            first = deletefront();
            break;

        case 7:
            deqdemo();
            break;

        case 8:
            exit(0);
        default:
            printf("\\nPlease Enter the valid choice ");
        }
    }
}`,
  program9: `#include<stdio.h>
#include<stdlib.h>
#include<math.h>

#define COMPARE(x, y)((x == y) ? 0 : (x > y) ? 1 : -1)

struct node
{
    int coef;
    int xexp, yexp, zexp;
    struct node * link;
};
typedef struct node * NODE;

NODE getnode()
{
    NODE x;
    x = (NODE) malloc(sizeof(struct node));
    if (x == NULL)
    {
        printf("Running out of memory \n");
        return NULL;
    }
    return x;
}

NODE attach(int coef, int xexp, int yexp, int zexp, NODE head)
{
    NODE temp, cur;
    temp = getnode();
    temp -> coef = coef;
    temp -> xexp = xexp;
    temp -> yexp = yexp;
    temp -> zexp = zexp;
    cur = head -> link;
    while (cur -> link != head)
    {
        cur = cur -> link;
    }
    cur -> link = temp;
    temp -> link = head;
    return head;
}

NODE read_poly(NODE head)
{
    int i, j, coef, xexp, yexp, zexp, n;
    printf("\nEnter the no of terms in the polynomial: ");
    scanf("%d", & n);
    for (i = 1; i <= n; i++)
    {
        printf("\n\tEnter the %d term: ", i);
        printf("\n\t\tCoef =  ");
        scanf("%d", & coef);
        printf("\n\t\tEnter Pow(x) Pow(y) and Pow(z): ");
        scanf("%d", & xexp);
        scanf("%d", & yexp);
        scanf("%d", & zexp);
        head = attach(coef, xexp, yexp, zexp, head);
    }
    return head;
}

void display(NODE head)
{
    NODE temp;
    if (head -> link == head)
    {
        printf("\nPolynomial does not exist.");
        return;
    }
    temp = head -> link;

    while (temp != head)
    {
        printf("%dx^%dy^%dz^%d", temp -> coef, temp -> xexp, temp -> yexp, temp -> zexp);
        temp = temp -> link;
        if (temp != head)
            printf(" + ");
    }
}

int poly_evaluate(NODE head)
{
    int x, y, z, sum = 0;
    NODE poly;

    printf("\\nEnter the value of x,y and z: ");
    scanf("%d %d %d", & x, & y, & z);

    poly = head -> link;
    while (poly != head)
    {
        sum += poly -> coef * pow(x, poly -> xexp) * pow(y, poly -> yexp) * pow(z, poly -> zexp);
        poly = poly -> link;
    }
    return sum;
}

NODE poly_sum(NODE head1, NODE head2, NODE head3)
{
    NODE a, b;
    int coef;
    a = head1 -> link;
    b = head2 -> link;

    while (a != head1 && b != head2)
    {
        while (1)
        {
            if (a -> xexp == b -> xexp && a -> yexp == b -> yexp && a -> zexp == b -> zexp)
            {
                coef = a -> coef + b -> coef;
                head3 = attach(coef, a -> xexp, a -> yexp, a -> zexp, head3);
                a = a -> link;
                b = b -> link;
                break;
            }
            if (a -> xexp != 0 || b -> xexp != 0)
            {
                switch (COMPARE(a -> xexp, b -> xexp))
                {
                case -1:
                    head3 = attach(b -> coef, b -> xexp, b -> yexp, b -> zexp, head3);
                    b = b -> link;
                    break;

                case 0:
                    if (a -> yexp > b -> yexp)
                    {
                        head3 = attach(a -> coef, a -> xexp, a -> yexp, a -> zexp, head3);
                        a = a -> link;
                        break;
                    }
                    else if (a -> yexp < b -> yexp)
                    {
                        head3 = attach(b -> coef, b -> xexp, b -> yexp, b -> zexp, head3);
                        b = b -> link;
                        break;
                    }
                    else if (a -> zexp > b -> zexp)
                    {
                        head3 = attach(a -> coef, a -> xexp, a -> yexp, a -> zexp, head3);
                        a = a -> link;
                        break;
                    }
                    else if (a -> zexp < b -> zexp)
                    {
                        head3 = attach(b -> coef, b -> xexp, b -> yexp, b -> zexp, head3);
                        b = b -> link;
                        break;
                    }
                case 1:
                    head3 = attach(a -> coef, a -> xexp, a -> yexp, a -> zexp, head3);
                    a = a -> link;
                    break;
                }
                break;
            }
            if (a -> yexp != 0 || b -> yexp != 0)
            {
                switch (COMPARE(a -> yexp, b -> yexp))
                {
                case -1:
                    head3 = attach(b -> coef, b -> xexp, b -> yexp, b -> zexp, head3);
                    b = b -> link;
                    break;
                case 0:
                    if (a -> zexp > b -> zexp)
                    {
                        head3 = attach(a -> coef, a -> xexp, a -> yexp, a -> zexp, head3);
                        a = a -> link;
                        break;
                    }
                    else if (a -> zexp < b -> zexp)
                    {
                        head3 = attach(b -> coef, b -> xexp, b -> yexp, b -> zexp, head3);
                        b = b -> link;
                        break;
                    }
                case 1:
                    head3 = attach(a -> coef, a -> xexp, a -> yexp, a -> zexp, head3);
                    a = a -> link;
                    break;
                }
                break;
            }
            if (a -> zexp != 0 || b -> zexp != 0)
            {
                switch (COMPARE(a -> zexp, b -> zexp))
                {
                case -1:
                    head3 = attach(b -> coef, b -> xexp, b -> yexp, b -> zexp, head3);
                    b = b -> link;
                    break;
                case 1:
                    head3 = attach(a -> coef, a -> xexp, a -> yexp, a -> zexp, head3);
                    a = a -> link;
                    break;
                }
                break;
            }
        }
    }
    while (a != head1)
    {
        head3 = attach(a -> coef, a -> xexp, a -> yexp, a -> zexp, head3);
        a = a -> link;
    }
    while (b != head2)
    {
        head3 = attach(b -> coef, b -> xexp, b -> yexp, b -> zexp, head3);
        b = b -> link;
    }
    return head3;
}

void main()
{
    NODE head, head1, head2, head3;
    int res, ch;
    head = getnode();
    head1 = getnode();
    head2 = getnode();
    head3 = getnode();

    head -> link = head;
    head1 -> link = head1;
    head2 -> link = head2;
    head3 -> link = head3;

    while (1)
    {
        printf("\n--------Menu--------");
        printf("\n1.Represent and Evaluate a Polynomial P(x,y,z)");
        printf("\n2.Find the sum of two polynomials POLY1(x,y,z)");
        printf("\nEnter your choice:");
        scanf("%d", & ch);
        switch (ch)
        {
        case 1:
            printf("\n----Polynomial evaluation P(x,y,z)----\n");
            head = read_poly(head);
            printf("\nRepresentation of Polynomial for evaluation: \n");
            display(head);
            res = poly_evaluate(head);
            printf("\nResult of polynomial evaluation is : %d \n", res);
            break;

        case 2:
            printf("\nEnter the POLY1(x,y,z):  \n");
            head1 = read_poly(head1);
            printf("\nPolynomial 1 is:  \n");
            display(head1);

            printf("\nEnter the POLY2(x,y,z):  \n");
            head2 = read_poly(head2);
            printf("\nPolynomial 2 is: \n");
            display(head2);

            printf("\nPolynomial addition result: \n");
            head3 = poly_sum(head1, head2, head3);
            display(head3);
            break;
        case 3:
            exit(0);
        }
    }
}`,
  program10: `#include<stdio.h>

#include<stdlib.h>

struct BST
{
    int data;
    struct BST * lchild;
    struct BST * rchild;
};
typedef struct BST * NODE;

NODE create()
{
    NODE temp;
    temp = (NODE) malloc(sizeof(struct BST));
    printf("\\nEnter The value: ");
    scanf("%d", & temp -> data);

    temp -> lchild = NULL;
    temp -> rchild = NULL;
    return temp;
}

void insert(NODE root, NODE newnode);
void inorder(NODE root);
void preorder(NODE root);
void postorder(NODE root);
void search(NODE root);

void insert(NODE root, NODE newnode)
{

    if (newnode -> data < root -> data)
    {
        if (root -> lchild == NULL)
            root -> lchild = newnode;
        else
            insert(root -> lchild, newnode);
    }
    if (newnode -> data > root -> data)
    {
        if (root -> rchild == NULL)
            root -> rchild = newnode;
        else
            insert(root -> rchild, newnode);
    }
}

void search(NODE root)
{
    int key;
    NODE cur;
    if (root == NULL)
    {
        printf("\\nBST is empty.");
        return;
    }
    printf("\\nEnter Element to be searched: ");
    scanf("%d", & key);
    cur = root;
    while (cur != NULL)
    {
        if (cur -> data == key)
        {
            printf("\\nKey element is present in BST ");
            return;
        }
        if (key < cur -> data)
            cur = cur -> lchild;
        else
            cur = cur -> rchild;
    }
    printf("\\nKey element is not found in the BST ");
}

void inorder(NODE root)
{
    if (root != NULL)
    {
        inorder(root -> lchild);
        printf("%d ", root -> data);
        inorder(root -> rchild);
    }
}

void preorder(NODE root)
{
    if (root != NULL)
    {
        printf("%d ", root -> data);
        preorder(root -> lchild);
        preorder(root -> rchild);
    }
}

void postorder(NODE root)
{
    if (root != NULL)
    {
        postorder(root -> lchild);
        postorder(root -> rchild);
        printf("%d ", root -> data);
    }
}

void main()
{
    int ch, key, val, i, n;
    NODE root = NULL, newnode;
    while (1)
    {
        printf("\\n-------BST MENU-------");
        printf("\\n1.Create a BST ");
        printf("\\n2.Search ");
        printf("\\n3.BST Traversals: ");
        printf("\\n4.Exit");
        printf("\\nEnter your choice: ");
        scanf("%d", & ch);
        switch (ch)
        {
        case 1:
            printf("\\nEnter the number of elements: ");
            scanf("%d", & n);
            for (i = 1; i <= n; i++)
            {
                newnode = create();
                if (root == NULL)
                    root = newnode;
                else
                    insert(root, newnode);
            }
            break;
        case 2:
            if (root == NULL)
                printf("\\nTree Is Not Created ");
            else
            {
                printf("\\nThe Preorder display: ");
                preorder(root);
                printf("\\nThe Inorder display: ");
                inorder(root);
                printf("\\nThe Postorder display: ");
                postorder(root);
            }

            break;
        case 3:
            search(root);
            break;

        case 4:
            exit(0);
        }
    }
}`,
  program11: `#include<stdio.h>
#include<stdlib.h>

int a[50][50], n, visited[50];
int q[20], front = -1, rear = -1;
int s[20], top = -1, count = 0;

void bfs(int v)
{
    int i, cur;
    visited[v] = 1;
    q[++rear] = v;
    while (front != rear)
    {
        cur = q[++front];
        for (i = 1; i <= n; i++)
        {
            if ((a[cur][i] == 1) && (visited[i] == 0))
            {
                q[++rear] = i;
                visited[i] = 1;
                printf("%d ", i);
            }
        }
    }
}

void dfs(int v)
{
    int i;
    visited[v] = 1;
    s[++top] = v;
    for (i = 1; i <= n; i++)
    {
        if (a[v][i] == 1 && visited[i] == 0)
        {
            printf("%d ", i);
            dfs(i);
        }
    }
}

int main()
{

    int ch, start, i, j;
    printf("\\nEnter the number of vertices in graph:");
    scanf("%d", & n);
    printf("\\nEnter the adjacency matrix:\\n");
    for (i = 1; i <= n; i++)
    {
        for (j = 1; j <= n; j++)
            scanf("%d", & a[i][j]);
    }

    for (i = 1; i <= n; i++)
        visited[i] = 0;
    printf("\\nEnter the starting vertex: ");
    scanf("%d", & start);

    printf("\\n==>1. BFS: Print all nodes reachable from a given starting node");
    printf("\\n==>2. DFS: Print all nodes reachable from a given starting node");
    printf("\\n==>3:Exit");
    printf("\\nEnter your choice: ");
    scanf("%d", & ch);
    switch (ch)
    {
    case 1:
        printf("\\nNodes reachable from starting vertex %d are: ", start);
        bfs(start);
        for (i = 1; i <= n; i++)
        {
            if (visited[i] == 0)
                printf("\\nThe vertex that is not reachable is %d", i);
        }
        break;

    case 2:
        printf("\\nNodes reachable from starting vertex %d are:\\n", start);
        dfs(start);
        break;
    case 3:
        exit(0);
    default:
        printf("\\nPlease enter valid choice:");
    }
}`,
  program12: `#include<stdio.h>

#include<stdlib.h>

int key[20], n, m;
int * ht, index;
int count = 0;

void insert(int key)
{
    index = key % m;
    while (ht[index] != -1)
    {
        index = (index + 1) % m;
    }
    ht[index] = key;
    count++;
}

void display()
{
    int i;
    if (count == 0)
    {
        printf("\\nHash Table is empty");
        return;
    }

    printf("\\nHash Table contents are:\\n ");
    for (i = 0; i < m; i++)
        printf("\\n T[%d] --> %d ", i, ht[i]);
}

void main()
{
    int i;
    printf("\\nEnter the number of employee  records (N): ");
    scanf("%d", & n);

    printf("\\nEnter the two digit memory locations (m) for hash table: ");
    scanf("%d", & m);

    ht = (int * ) malloc(m * sizeof(int));
    for (i = 0; i < m; i++)
        ht[i] = -1;

    printf("\\nEnter the four digit key values (K) for N Employee Records:\\n ");
    for (i = 0; i < n; i++)
        scanf("%d", & key[i]);

    for (i = 0; i < n; i++)
    {
        if (count == m)
        {
            printf("\\n-----Hash table is full. Cannot insert the record %d key-----", i + 1);
            break;
        }
        insert(key[i]);
    }

    display();
}
`,
};


export const CPP_CODE = {
  program1: `#include <iostream>
#include <string>
#include <vector>

struct Day {
    std::string dayName;
    int date;
    std::string activity;
};

void create(Day &day) {
    std::cout << "Enter the day name: ";
    std::cin >> day.dayName;
    std::cout << "Enter the date: ";
    std::cin >> day.date;
    std::cout << "Enter the activity for the day: ";
    std::cin.ignore();
    std::getline(std::cin, day.activity);
}

void read(std::vector<Day>& calendar) {
    for (size_t i = 0; i < calendar.size(); i++) {
        std::cout << "Enter details for Day " << i + 1 << ":\\n";
        create(calendar[i]);
    }
}

void display(const std::vector<Day>& calendar) {
    std::cout << "\\nWeek's Activity Details:\\n";
    for (size_t i = 0; i < calendar.size(); i++) {
        std::cout << "Day " << i + 1 << ":\\n";
        std::cout << "Day Name: " << calendar[i].dayName << "\\n";
        std::cout << "Date: " << calendar[i].date << "\\n";
        std::cout << "Activity: " << calendar[i].activity << "\\n\\n";
    }
}

int main() {
    int size;
    std::cout << "Enter the number of days in the week: ";
    std::cin >> size;
    std::vector<Day> calendar(size);
    read(calendar);
    display(calendar);
    return 0;
}`,
  program2: `#include <iostream>
#include <string>

void stringMatch() {
    std::string str, pat, rep, res;
    std::cout << "Enter the main string: "; std::getline(std::cin, str);
    std::cout << "Enter the pattern string: "; std::getline(std::cin, pat);
    std::cout << "Enter the replace string: "; std::getline(std::cin, rep);

    size_t pos = 0;
    res = str;
    bool found = false;
    while ((pos = res.find(pat, pos)) != std::string::npos) {
        res.replace(pos, pat.length(), rep);
        pos += rep.length();
        found = true;
    }

    if (found) std::cout << "Result: " << res << std::endl;
    else std::cout << "Pattern string is not found" << std::endl;
}

int main() {
    stringMatch();
    return 0;
}`,
  program3: `#include <iostream>
#include <vector>
#include <algorithm>

class Stack {
    std::vector<int> s;
    int MAX;
public:
    Stack(int size) : MAX(size) {}
    void push(int item) {
        if (s.size() == MAX) std::cout << "Stack Overflow\\n";
        else s.push_back(item);
    }
    int pop() {
        if (s.empty()) { std::cout << "Stack Underflow\\n"; return -1; }
        int val = s.back(); s.pop_back(); return val;
    }
    void palindrome() {
        std::vector<int> temp = s;
        std::reverse(temp.begin(), temp.end());
        if (temp == s) std::cout << "It is a Palindrome\\n";
        else std::cout << "It is not a Palindrome\\n";
    }
    void display() {
        if (s.empty()) std::cout << "Stack Empty\\n";
        else {
            for (int i = s.size() - 1; i >= 0; i--) std::cout << s[i] << " ";
            std::cout << "\\n";
        }
    }
};

int main() {
    Stack st(5);
    st.push(1); st.push(2); st.push(1);
    st.display();
    st.palindrome();
    return 0;
}`,
  program4: `#include <iostream>
#include <stack>
#include <string>
#include <cctype>

int priority(char x) {
    if (x == '(') return 0;
    if (x == '+' || x == '-') return 1;
    if (x == '*' || x == '/' || x == '%') return 2;
    if (x == '^') return 3;
    return 0;
}

int main() {
    std::string infix, postfix = "";
    std::stack<char> s;
    std::cout << "Enter Infix: "; std::cin >> infix;
    for (char c : infix) {
        if (isalnum(c)) postfix += c;
        else if (c == '(') s.push(c);
        else if (c == ')') {
            while (s.top() != '(') { postfix += s.top(); s.pop(); }
            s.pop();
        } else {
            while (!s.empty() && priority(s.top()) >= priority(c)) {
                postfix += s.top(); s.pop();
            }
            s.push(c);
        }
    }
    while (!s.empty()) { postfix += s.top(); s.pop(); }
    std::cout << "Postfix: " << postfix << "\\n";
    return 0;
}`,
  program5a: `#include <iostream>
#include <stack>
#include <string>
#include <cmath>

int main() {
    std::string postfix;
    std::stack<double> s;
    std::cout << "Enter Postfix: "; std::cin >> postfix;
    for (char c : postfix) {
        if (isdigit(c)) s.push(c - '0');
        else {
            double op2 = s.top(); s.pop();
            double op1 = s.top(); s.pop();
            switch (c) {
                case '+': s.push(op1 + op2); break;
                case '-': s.push(op1 - op2); break;
                case '*': s.push(op1 * op2); break;
                case '/': s.push(op1 / op2); break;
                case '^': s.push(pow(op1, op2)); break;
            }
        }
    }
    std::cout << "Result: " << s.top() << "\\n";
    return 0;
}`,
  program5b: `#include <iostream>
void tower(int n, char s, char t, char d) {
    if (n == 0) return;
    tower(n - 1, s, d, t);
    std::cout << "Move disc " << n << " from " << s << " to " << d << "\\n";
    tower(n - 1, t, s, d);
}
int main() {
    int n;
    std::cout << "Enter number of discs: "; std::cin >> n;
    tower(n, 'A', 'B', 'C');
    return 0;
}`,
  program6: `#include <iostream>
#include <vector>

class CircularQueue {
    std::vector<char> q;
    int f, r, size;
public:
    CircularQueue(int s) : size(s), f(-1), r(-1), q(s) {}
    void insert(char c) {
        if ((r + 1) % size == f) std::cout << "Queue Full\\n";
        else {
            if (f == -1) f = 0;
            r = (r + 1) % size;
            q[r] = c;
        }
    }
    void remove() {
        if (f == -1) std::cout << "Queue Empty\\n";
        else {
            if (f == r) f = r = -1;
            else f = (f + 1) % size;
        }
    }
    void display() {
        if (f == -1) std::cout << "Empty\\n";
        else {
            int i = f;
            while (true) {
                std::cout << q[i] << " ";
                if (i == r) break;
                i = (i + 1) % size;
            }
            std::cout << "\\n";
        }
    }
};

int main() {
    CircularQueue cq(5);
    cq.insert('A'); cq.insert('B'); cq.display();
    return 0;
}`,
  program7: `#include <iostream>
#include <string>

struct Node {
    std::string usn, name, branch;
    int sem; long long phone;
    Node* next;
    Node(std::string u, std::string n, std::string b, int s, long long p)
        : usn(u), name(n), branch(b), sem(s), phone(p), next(nullptr) {}
};

class StudentList {
    Node* head = nullptr;
public:
    void insertFront(std::string u, std::string n, std::string b, int s, long long p) {
        Node* newNode = new Node(u, n, b, s, p);
        newNode->next = head;
        head = newNode;
    }
    void display() {
        Node* curr = head;
        while (curr) {
            std::cout << curr->usn << " " << curr->name << "\\n";
            curr = curr->next;
        }
    }
};

int main() {
    StudentList list;
    list.insertFront("101", "Alice", "CS", 3, 9876543210);
    list.display();
    return 0;
}`,
  program8: `#include <iostream>
#include <string>

struct Node {
    std::string ssn, name, dept, design;
    double sal; long long phone;
    Node *prev, *next;
    Node(std::string s, std::string n, std::string d, std::string dg, double sl, long long p)
        : ssn(s), name(n), dept(d), design(dg), sal(sl), phone(p), prev(nullptr), next(nullptr) {}
};

class EmployeeList {
    Node *head = nullptr, *tail = nullptr;
public:
    void insertEnd(std::string s, std::string n, std::string d, std::string dg, double sl, long long p) {
        Node* newNode = new Node(s, n, d, dg, sl, p);
        if (!head) head = tail = newNode;
        else { tail->next = newNode; newNode->prev = tail; tail = newNode; }
    }
    void display() {
        Node* curr = head;
        while (curr) {
            std::cout << curr->ssn << " " << curr->name << "\\n";
            curr = curr->next;
        }
    }
};

int main() {
    EmployeeList list;
    list.insertEnd("E01", "Bob", "HR", "Mgr", 50000, 1234567890);
    list.display();
    return 0;
}`,
  program9: `#include <iostream>
#include <cmath>

struct Node {
    int co, x, y, z;
    Node* next;
    Node(int c, int _x, int _y, int _z) : co(c), x(_x), y(_y), z(_z), next(nullptr) {}
};

class Poly {
    Node* head;
public:
    Poly() { head = new Node(0, -1, -1, -1); head->next = head; }
    void insert(int c, int x, int y, int z) {
        Node* newNode = new Node(c, x, y, z);
        Node* curr = head;
        while (curr->next != head) curr = curr->next;
        curr->next = newNode; newNode->next = head;
    }
    double evaluate(int x, int y, int z) {
        double sum = 0;
        Node* curr = head->next;
        while (curr != head) {
            sum += curr->co * pow(x, curr->x) * pow(y, curr->y) * pow(z, curr->z);
            curr = curr->next;
        }
        return sum;
    }
};

int main() {
    Poly p; p.insert(3, 2, 1, 0);
    std::cout << p.evaluate(1, 2, 3) << "\\n";
    return 0;
}`,
  program10: `#include <iostream>

struct Node {
    int data;
    Node *left, *right;
    Node(int d) : data(d), left(nullptr), right(nullptr) {}
};

class BST {
    Node* root = nullptr;
    Node* insert(Node* node, int data) {
        if (!node) return new Node(data);
        if (data < node->data) node->left = insert(node->left, data);
        else if (data > node->data) node->right = insert(node->right, data);
        return node;
    }
    void inorder(Node* node) {
        if (node) { inorder(node->left); std::cout << node->data << " "; inorder(node->right); }
    }
public:
    void insert(int data) { root = insert(root, data); }
    void inorder() { inorder(root); std::cout << "\\n"; }
};

int main() {
    BST tree; tree.insert(5); tree.insert(3); tree.insert(7);
    tree.inorder();
    return 0;
}`,
  program11: `#include <iostream>
#include <vector>
#include <queue>

void bfs(int start, const std::vector<std::vector<int>>& adj) {
    std::vector<bool> visited(adj.size(), false);
    std::queue<int> q;
    visited[start] = true; q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        std::cout << u << " ";
        for (int v : adj[u]) if (!visited[v]) { visited[v] = true; q.push(v); }
    }
    std::cout << "\\n";
}

int main() {
    std::vector<std::vector<int>> adj = {{1, 2}, {0, 3}, {0, 3}, {1, 2}};
    bfs(0, adj);
    return 0;
}`,
  program12: `#include <iostream>
#include <vector>

int main() {
    int m = 10;
    std::vector<int> ht(m, -1);
    auto insert = [&](int key) {
        int idx = key % m;
        while (ht[idx] != -1) idx = (idx + 1) % m;
        ht[idx] = key;
    };
    insert(15); insert(25);
    for (int i = 0; i < m; i++) std::cout << i << ": " << ht[i] << "\\n";
    return 0;
}`,
};


export const PYTHON_CODE = {
  program1: `class Day:
    def __init__(self, name="", date=0, activity=""):
        self.name, self.date, self.activity = name, date, activity

def main():
    try:
        n = int(input("Enter number of days: "))
        calendar = []
        for i in range(n):
            print(f"Details for Day {i+1}:")
            name = input("Name: ")
            date = int(input("Date: "))
            act = input("Activity: ")
            calendar.append(Day(name, date, act))
        
        print("\\nWeek's Activity Details:")
        for d in calendar:
            print(f"Day: {d.name}, Date: {d.date}, Activity: {d.activity}")
    except ValueError:
        print("Invalid input")

if __name__ == "__main__":
    main()`,
  program2: `def string_match():
    text = input("Main string: ")
    pat = input("Pattern: ")
    rep = input("Replace: ")
    if pat in text:
        print("Result:", text.replace(pat, rep))
    else:
        print("Pattern not found")

string_match()`,
  program3: `class Stack:
    def __init__(self, size=5):
        self.s = []
        self.MAX = size
    def push(self, item):
        if len(self.s) == self.MAX: print("Overflow")
        else: self.s.append(item)
    def pop(self):
        return self.s.pop() if self.s else print("Underflow")
    def is_palindrome(self):
        if self.s == self.s[::-1]: print("Palindrome")
        else: print("Not Palindrome")
    def display(self):
        print("Stack:", self.s[::-1])

st = Stack(); st.push(1); st.push(2); st.push(1); st.display(); st.is_palindrome()`,
  program4: `def priority(op):
    if op == '(': return 0
    if op in '+-': return 1
    if op in '*/%': return 2
    if op == '^': return 3
    return 0

def infix_to_postfix(exp):
    stack = []
    output = ""
    for char in exp:
        if char.isalnum(): output += char
        elif char == '(': stack.append('(')
        elif char == ')':
            while stack and stack[-1] != '(': output += stack.pop()
            stack.pop()
        else:
            while stack and priority(stack[-1]) >= priority(char):
                output += stack.pop()
            stack.append(char)
    while stack: output += stack.pop()
    print("Postfix:", output)

infix_to_postfix("a+b*c")`,
  program5a: `def evaluate_postfix(exp):
    stack = []
    for char in exp:
        if char.isdigit(): stack.append(int(char))
        else:
            op2, op1 = stack.pop(), stack.pop()
            if char == '+': stack.append(op1 + op2)
            elif char == '-': stack.append(op1 - op2)
            elif char == '*': stack.append(op1 * op2)
            elif char == '/': stack.append(op1 / op2)
            elif char == '^': stack.append(op1 ** op2)
    print("Result:", stack.pop())

evaluate_postfix("23+")`,
  program5b: `def tower(n, s, t, d):
    if n == 0: return
    tower(n-1, s, d, t)
    print(f"Move {n} from {s} to {d}")
    tower(n-1, t, s, d)

tower(3, 'A', 'B', 'C')`,
  program6: `class CircularQueue:
    def __init__(self, size=5):
        self.size = size
        self.q = [None] * size
        self.f = self.r = -1
    def insert(self, data):
        if (self.r + 1) % self.size == self.f: print("Full")
        else:
            if self.f == -1: self.f = 0
            self.r = (self.r + 1) % self.size
            self.q[self.r] = data
    def remove(self):
        if self.f == -1: print("Empty")
        elif self.f == self.r: self.f = self.r = -1
        else: self.f = (self.f + 1) % self.size
    def display(self):
        if self.f == -1: print("Empty")
        else:
            i = self.f
            while True:
                print(self.q[i], end=" ")
                if i == self.r: break
                i = (i + 1) % self.size
            print()

cq = CircularQueue(); cq.insert('A'); cq.display()`,
  program7: `class Node:
    def __init__(self, usn, name):
        self.usn, self.name, self.next = usn, name, None

class SLL:
    def __init__(self): self.head = None
    def insert_front(self, u, n):
        new_node = Node(u, n)
        new_node.next = self.head
        self.head = new_node
    def display(self):
        curr = self.head
        while curr: print(curr.name); curr = curr.next

s = SLL(); s.insert_front("1", "Alice"); s.display()`,
  program8: `class Node:
    def __init__(self, ssn, name):
        self.ssn, self.name = ssn, name
        self.prev = self.next = None

class DLL:
    def __init__(self): self.head = self.tail = None
    def insert_end(self, s, n):
        new_node = Node(s, n)
        if not self.head: self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node
    def display(self):
        curr = self.head
        while curr: print(curr.name); curr = curr.next

d = DLL(); d.insert_end("E1", "Bob"); d.display()`,
  program9: `class Node:
    def __init__(self, co, x, y, z):
        self.co, self.x, self.y, self.z = co, x, y, z
        self.next = None

class Poly:
    def __init__(self):
        self.head = Node(0, -1, -1, -1)
        self.head.next = self.head
    def insert(self, c, x, y, z):
        new_node = Node(c, x, y, z)
        curr = self.head
        while curr.next != self.head: curr = curr.next
        curr.next = new_node
        new_node.next = self.head
    def evaluate(self, x, y, z):
        res, curr = 0, self.head.next
        while curr != self.head:
            res += curr.co * (x**curr.x) * (y**curr.y) * (z**curr.z)
            curr = curr.next
        return res

p = Poly(); p.insert(3, 2, 1, 0); print(p.evaluate(1, 2, 3))`,
  program10: `class Node:
    def __init__(self, d):
        self.data, self.left, self.right = d, None, None

def insert(node, d):
    if not node: return Node(d)
    if d < node.data: node.left = insert(node.left, d)
    else: node.right = insert(node.right, d)
    return node

def inorder(node):
    if node:
        inorder(node.left)
        print(node.data, end=" ")
        inorder(node.right)

root = None; root = insert(root, 5); root = insert(root, 3); inorder(root)`,
  program11: `def bfs(adj, s):
    visited, queue = {s}, [s]
    while queue:
        u = queue.pop(0)
        print(u, end=" ")
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)

bfs({0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}, 0)`,
  program12: `def hashing(m, keys):
    ht = [-1] * m
    for k in keys:
        idx = k % m
        while ht[idx] != -1: idx = (idx + 1) % m
        ht[idx] = k
    print(ht)

hashing(10, [15, 25, 35])`,
};


export const JAVA_CODE = {
  program1: `import java.util.Scanner;

class Day {
    String dayName;
    int date;
    String activity;
}

public class WeeklyCalendar {
    static Scanner scanner = new Scanner(System.in);

    public static void create(Day day) {
        System.out.print("Enter day name: "); day.dayName = scanner.next();
        System.out.print("Enter date: "); day.date = scanner.nextInt();
        scanner.nextLine(); 
        System.out.print("Enter activity: "); day.activity = scanner.nextLine();
    }

    public static void main(String[] args) {
        System.out.print("Enter number of days: ");
        int size = scanner.nextInt();
        Day[] calendar = new Day[size];
        for (int i = 0; i < size; i++) {
            calendar[i] = new Day();
            create(calendar[i]);
        }
        System.out.println("\\nWeek's Details:");
        for (Day d : calendar) System.out.println(d.dayName + " " + d.date + ": " + d.activity);
    }
}`,
  program2: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine(), p = sc.nextLine(), r = sc.nextLine();
        if (s.contains(p)) System.out.println(s.replace(p, r));
        else System.out.println("Pattern not found");
    }
}`,
  program3: `import java.util.Stack;

public class Main {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        s.push(1); s.push(2); s.push(1);
        System.out.println("Popped: " + s.pop());
        // Palindrome logic...
    }
}`,
  program4: `import java.util.Stack;

public class InfixToPostfix {
    static int priority(char x) {
        if(x == '(') return 0;
        if(x == '+' || x == '-') return 1;
        if(x == '*' || x == '/' || x == '%') return 2;
        if(x == '^') return 3;
        return 0;
    }

    public static void convert(String exp) {
        Stack<Character> s = new Stack<>();
        StringBuilder res = new StringBuilder();
        for (char c : exp.toCharArray()) {
            if (Character.isLetterOrDigit(c)) res.append(c);
            else if (c == '(') s.push(c);
            else if (c == ')') {
                while (s.peek() != '(') res.append(s.pop());
                s.pop();
            } else {
                while (!s.isEmpty() && priority(s.peek()) >= priority(c)) res.append(s.pop());
                s.push(c);
            }
        }
        while (!s.isEmpty()) res.append(s.pop());
        System.out.println("Postfix: " + res);
    }

    public static void main(String[] args) { convert("a+b*c"); }
}`,
  program5a: `import java.util.Stack;

public class PostfixEval {
    public static void evaluate(String exp) {
        Stack<Double> s = new Stack<>();
        for (char c : exp.toCharArray()) {
            if (Character.isDigit(c)) s.push((double)(c - '0'));
            else {
                double o2 = s.pop(), o1 = s.pop();
                switch(c) {
                    case '+': s.push(o1 + o2); break;
                    case '-': s.push(o1 - o2); break;
                    case '*': s.push(o1 * o2); break;
                    case '/': s.push(o1 / o2); break;
                    case '^': s.push(Math.pow(o1, o2)); break;
                }
            }
        }
        System.out.println("Result: " + s.pop());
    }

    public static void main(String[] args) { evaluate("23+"); }
}`,
  program5b: `public class TowerOfHanoi {
    public static void tower(int n, char s, char t, char d) {
        if (n == 0) return;
        tower(n-1, s, d, t);
        System.out.println("Move " + n + " from " + s + " to " + d);
        tower(n-1, t, s, d);
    }

    public static void main(String[] args) { tower(3, 'A', 'B', 'C'); }
}`,
  program6: `public class CircularQueue {
    char[] q; int f = -1, r = -1, size;
    CircularQueue(int s) { size = s; q = new char[s]; }
    void insert(char c) {
        if ((r+1)%size == f) System.out.println("Full");
        else { if (f == -1) f = 0; r = (r+1)%size; q[r] = c; }
    }
    void display() {
        if (f == -1) return;
        int i = f;
        while (true) {
            System.out.print(q[i] + " ");
            if (i == r) break;
            i = (i+1)%size;
        }
    }

    public static void main(String[] args) { CircularQueue q = new CircularQueue(5); q.insert('A'); q.display(); }
}`,
  program7: `class Node { String usn, name; Node next; Node(String u, String n) { usn=u; name=n; } }

public class SLL {
    Node head;
    void insertFront(String u, String n) {
        Node newNode = new Node(u, n); newNode.next = head; head = newNode;
    }
    void display() {
        Node curr = head;
        while (curr != null) { System.out.println(curr.name); curr = curr.next; }
    }

    public static void main(String[] args) { SLL s = new SLL(); s.insertFront("1", "Alice"); s.display(); }
}`,
  program8: `class Node { String ssn, name; Node prev, next; Node(String s, String n) { ssn=s; name=n; } }

public class DLL {
    Node head, tail;
    void insertEnd(String s, String n) {
        Node newNode = new Node(s, n);
        if (head == null) head = tail = newNode;
        else { tail.next = newNode; newNode.prev = tail; tail = newNode; }
    }
    void display() {
        Node curr = head;
        while (curr != null) { System.out.println(curr.name); curr = curr.next; }
    }

    public static void main(String[] args) { DLL d = new DLL(); d.insertEnd("E1", "Bob"); d.display(); }
}`,
  program9: `class Node { int co, x, y, z; Node next; Node(int c, int _x, int _y, int _z) { co=c; x=_x; y=_y; z=_z; } }

public class Polynomial {
    Node head;
    Polynomial() { head = new Node(0, -1, -1, -1); head.next = head; }
    void insert(int c, int x, int y, int z) {
        Node newNode = new Node(c, x, y, z), curr = head;
        while (curr.next != head) curr = curr.next;
        curr.next = newNode; newNode.next = head;
    }
    double evaluate(int x, int y, int z) {
        double res = 0; Node curr = head.next;
        while (curr != head) {
            res += curr.co * Math.pow(x, curr.x) * Math.pow(y, curr.y) * Math.pow(z, curr.z);
            curr = curr.next;
        }
        return res;
    }

    public static void main(String[] args) { Polynomial p = new Polynomial(); p.insert(3, 2, 1, 0); System.out.println(p.evaluate(1, 2, 3)); }
}`,
  program10: `class Node { int data; Node left, right; Node(int d) { data = d; } }

public class BST {
    Node root;
    Node insert(Node node, int d) {
        if (node == null) return new Node(d);
        if (d < node.data) node.left = insert(node.left, d);
        else node.right = insert(node.right, d);
        return node;
    }
    void inorder(Node node) {
        if (node != null) { inorder(node.left); System.out.print(node.data + " "); inorder(node.right); }
    }

    public static void main(String[] args) { BST t = new BST(); t.root = t.insert(t.root, 5); t.inorder(t.root); }
}`,
  program11: `import java.util.*;

public class Graph {
    static void bfs(int s, List<List<Integer>> adj) {
        boolean[] v = new boolean[adj.size()];
        Queue<Integer> q = new LinkedList<>();
        v[s] = true; q.add(s);
        while (!q.isEmpty()) {
            int u = q.poll(); System.out.print(u + " ");
            for (int neighbor : adj.get(u)) if (!v[neighbor]) { v[neighbor] = true; q.add(neighbor); }
        }
    }

    public static void main(String[] args) {
        List<List<Integer>> adj = Arrays.asList(Arrays.asList(1, 2), Arrays.asList(0, 3), Arrays.asList(0, 3), Arrays.asList(1, 2));
        bfs(0, adj);
    }
}`,
  program12: `public class Hash {
    public static void main(String[] args) {
        int m = 10; int[] ht = new int[m];
        for (int i=0; i<m; i++) ht[i] = -1;
        int[] keys = {15, 25, 35};
        for (int k : keys) {
            int idx = k % m;
            while (ht[idx] != -1) idx = (idx + 1) % m;
            ht[idx] = k;
        }
        for (int i=0; i<m; i++) System.out.println(i + ": " + ht[i]);
    }
}`,
};

export const programsData = [
  {
    id: "program1",
    name: "Program 1",
    category: "Basic",
    difficulty: "Easy",
    time: "O(1)",
    space: "O(1)",
  },
  {
    id: "program2",
    name: "Program 2",
    category: "Strings",
    difficulty: "Easy",
    time: "O(N)",
    space: "O(N)",
  },
  {
    id: "program3",
    name: "Program 3",
    category: "Stack",
    difficulty: "Easy",
    time: "O(N)",
    space: "O(N)",
  },
  {
    id: "program4",
    name: "Program 4",
    category: "Queue",
    difficulty: "Easy",
    time: "O(N)",
    space: "O(N)",
  },
  {
    id: "program5a",
    name: "Program 5A",
    category: "Recursion",
    difficulty: "Medium",
    time: "O(N)",
    space: "O(N)",
  },
  {
    id: "program5b",
    name: "Program 5B",
    category: "Recursion",
    difficulty: "Medium",
    time: "O(2^N)",
    space: "O(N)",
  },
  {
    id: "program6",
    name: "Program 6",
    category: "Circular Queue",
    difficulty: "Medium",
    time: "O(1)",
    space: "O(N)",
  },
  {
    id: "program7",
    name: "Program 7",
    category: "Linked List",
    difficulty: "Medium",
    time: "O(N)",
    space: "O(N)",
  },
  {
    id: "program8",
    name: "Program 8",
    category: "Linked List",
    difficulty: "Medium",
    time: "O(N)",
    space: "O(N)",
  },
  {
    id: "program9",
    name: "Program 9",
    category: "Polynomial",
    difficulty: "Hard",
    time: "O(N*M)",
    space: "O(N+M)",
  },
  {
    id: "program10",
    name: "Program 10",
    category: "BST",
    difficulty: "Hard",
    time: "O(H)",
    space: "O(H)",
  },
  {
    id: "program11",
    name: "Program 11",
    category: "Graphs",
    difficulty: "Hard",
    time: "O(V+E)",
    space: "O(V)",
  },
  {
    id: "program12",
    name: "Program 12",
    category: "Hashing",
    difficulty: "Medium",
    time: "O(1) avg",
    space: "O(M)",
  },
];

export const notes = [
  { name: "Module 1", href: "/notes/BCS304-module-1.pdf" },
  { name: "Module 2", href: "/notes/BCS304-module-2.pdf" },
  { name: "Module 3", href: "/notes/BCS304-module-3.pdf" },
  { name: "Module 4", href: "/notes/BCS304-module-4.pdf" },
  { name: "Module 5", href: "/notes/BCS304-module-5.pdf" },
];