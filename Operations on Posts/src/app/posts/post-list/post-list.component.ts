import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component ({
    selector : 'app-post-list',
    templateUrl : './post-list.component.html',
    styleUrls : ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {  //OnInit , OnDestroy are life cycle hoocks
    // posts = [
    //     {title : 'First Post' , content : 'This is the content of the first post'},
    //     {title : 'Second Post' , content : 'This is the content of the second post'},
    //     {title : 'Third Post' , content : 'This is the content of the third post'}
    // ];
    //@Input() posts : Post[] = []; we are not fetching posts when we are using services
    posts : Post[] = [];
    isLoading = false;
    totalPosts = 0; 
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    userId: string;
    private postsSub : Subscription;
    private authStatusSub: Subscription;

    constructor(private postsService : PostsService, private authService: AuthService) {}
    
    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSub = this.postsService.getPostUpdateListner()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        //console.log(pageData);
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId)
        .subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}